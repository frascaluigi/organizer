import * as supertest from 'supertest';
import setupApp from '../appExpressConfig';
import { StatusCode } from '../src/helpers/ErrorCustom';

const request = supertest(setupApp());

describe('Health Controller Test', () => {
	it('should test that health route is working', async (done) => {
		const response = await request.get('/health');
		expect(response.status).toBe(StatusCode.Ok);
		expect(response.body.name).toBe('organizer');
		done();
	});
});