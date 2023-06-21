import express from 'express';
import router from './routes';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (request: Request, response: Response) => {
	response.send('POC Kafka is running');
});

app.use('/', router);

app.listen(port, () => {
	console.log(`POC Kafka is running`);
});
