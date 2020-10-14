import * as supertest from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import setupApp from '../appExpressConfig';
import { StatusCode } from '../src/helpers/ErrorCustom';
import {connection} from '../index';
import { User } from '../src/entities/User';

const request = supertest(setupApp());

const emailTestRegister = 'lfrasca@test.it'
const pwdTestRegister = '12345678'

let dbConnection;
describe('Auth Controller Test', () => {
    beforeAll((done) => {
        createConnection(connection)
          .then(async connection => {
            dbConnection = connection
            done();
          })
          .catch(error => {
            console.log("ERROR creating DB",error);
            done(error)
          });
    });

    describe('flow login and registration', () =>{
        it('try login with fake credential should respond unhautorized', async (done) => {
            request
                .post("/auth/login/")
                .expect("Content-type", /json/)
                .send({"email":"lfrasca@fake.it", "password":"12345678"})
                .expect(StatusCode.Unauthorized)
                .end(function(err, res) {
                    if(err) return done(err);
                    done();
                })
        });

        it(`try REGISTER new user with password too short SHOULD respond ${StatusCode.BadRequest}`, async (done) => {
            request
                .post("/auth/register/")
                .send({email:emailTestRegister, password:'asd', firstName:"#TEST-FIRSTNAME", lastName:"#TEST-LASTNAME"})
                .expect(StatusCode.BadRequest)
                .end(function(err, res) {
                    if(err) return done(err);
                    done();
                })
        });

        it(`try REGISTER new user with firstName too short SHOULD respond ${StatusCode.BadRequest}`, async (done) => {
            request
                .post("/auth/register/")
                .send({email:emailTestRegister, password:'asd', firstName:"", lastName:"#TEST-LASTNAME"})
                .expect(StatusCode.BadRequest)
                .end(function(err, res) {
                    if(err) return done(err);
                    done();
                })
        });

        it(`try REGISTER new user correct SHOULD respond ${StatusCode.Created}`, async (done) => {
            request
                .post("/auth/register/")
                .send({email:emailTestRegister, password:pwdTestRegister, firstName:"#TEST-FIRSTNAME", lastName:"#TEST-LASTNAME"})
                .expect(StatusCode.Created)
                .end(function(err, res) {
                    if(err) return done(err);
                    done();
                })
        });

        it('try LOGIN with correct credential should be authorized', async (done) => {
            request
                .post("/auth/login/")
                .expect("Content-type", /json/)
                .send({"email":emailTestRegister, "password":pwdTestRegister})
                .expect(StatusCode.Ok)
                .end(function(err, res) {
                    if(err) return done(err);
                    expect(res.body).toHaveProperty('token');
                    done();
                })
        });
    })

    afterAll(async function(){
        await getRepository(User).delete({email:emailTestRegister})
        await dbConnection.close()
    });
});