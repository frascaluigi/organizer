import * as supertest from 'supertest';
import { createConnection, getRepository } from 'typeorm';
import setupApp from '../appExpressConfig';
import { StatusCode } from '../src/helpers/ErrorCustom';
import {connection} from '../index';
import { User } from '../src/entities/User';

const request = supertest(setupApp());

let dbConnection;

let tokenAuth;

const emailTestRegister = 'lfrasca+event@test.it'
const pwdTestRegister = '12345678'

describe('Event Controller Test', () => {

    beforeAll((done) => {
        createConnection(connection)
          .then(async connection => {
            // Create a new express application instance
            dbConnection = connection
            done();
          })
          .catch(error => {
            console.log("ERROR creating DB",error);
            done(error)
          });
    });

    describe('flow create and show events', () =>{


        it('try see all events in week without token should respond unhautorized', async (done) => {
            request
                .get("/event/in-week/")
                .expect(StatusCode.Unauthorized)
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
                    tokenAuth = res.body.token;
                    done();
                })
        });

        it(`try see all events in week with token should respond ${StatusCode.Ok}`, async (done) => {
            request
                .get("/event/in-week/")
                .expect("Content-type", /json/)
                .set('auth', tokenAuth)
                .expect(StatusCode.Ok)
                .end(function(err, res) {
                    if(err) return done(err);
                    expect(res.body).toHaveProperty('events');
                    expect(res.body.events).toHaveLength(0);
                    done();
                })
        });

        it(`try create event with name too short ${StatusCode.BadRequest}`, async (done) => {
            request
                .post("/event/")
                .expect("Content-type", /json/)
                .set('auth', tokenAuth)
                .send({"name":"", "address":"viale zara, milano, 20159", "start":new Date(),"end":new Date()})
                .expect(StatusCode.BadRequest)
                .end(function(err, res) {
                    if(err) return done(err);
                    done();
                })
        });

        let eventId;
        it(`try create event with token should respond ${StatusCode.Ok}`, async (done) => {
            request
                .post("/event/")
                .expect("Content-type", /json/)
                .set('auth', tokenAuth)
                .send({"name":"Taglio di capelli", "address":"viale zara, milano, 20159", "start":new Date(),"end":new Date()})
                .expect(StatusCode.Created)
                .end(function(err, res) {
                    if(err) return done(err);
                    expect(res.body).toHaveProperty('id');
                    eventId = res.body.id;
                    done();
                })
        });

        it(`try see all events in week with token should respond ${StatusCode.Ok}`, async (done) => {
            request
                .get("/event/in-week/")
                .expect("Content-type", /json/)
                .set('auth', tokenAuth)
                .expect(StatusCode.Ok)
                .end(function(err, res) {
                    if(err) return done(err);
                    expect(res.body).toHaveProperty('events');
                    expect(res.body.events).toHaveLength(1);
                    done();
                })
        });

        it(`try delete event with token should respond ${StatusCode.NoContent}`, async (done) => {
            request
                .delete("/event/"+eventId)
                .set('auth', tokenAuth)
                .expect(StatusCode.NoContent)
                .end(function(err, res) {
                    if(err) return done(err);
                    done();
                })
        });

    })

    afterAll(async function(){
        await getRepository(User).delete({email:emailTestRegister})
        await dbConnection.close()
    });
})