import { Kafka, ConfigResourceTypes } from 'kafkajs';
import { Request, Response } from 'express';

const kafka = new Kafka({
	clientId: 'poc-kafka',
	brokers: ['localhost:9092','localhost:9093','localhost:9094']
});

export const createTopic = async (request: Request, response: Response) => {
	try {
		const { nameTopic, numberPartitions, replicationFactor } = request.body;
		const admin = kafka.admin();

		await admin.connect();

		const result = await admin.createTopics({
			validateOnly: false,
			waitForLeaders: true,
			timeout: 50000,
			topics: [{
				topic: nameTopic,
				numPartitions: numberPartitions,
				replicationFactor: replicationFactor,
				replicaAssignment: [],
				configEntries: []
			}],
		});

		await admin.disconnect();

		response.json({
			response: result ?
				`Topic ${nameTopic} successfully created!` :
				`Topic ${nameTopic} already exists!`
		});

	} catch (error) {
		response.json({ error: error instanceof Error ? error.message : 'Unexpected error' })
	}
}

export const listCreatedTopics = async (request: Request, response: Response) => {
	try {
		const admin = kafka.admin();
		const data = await admin.listTopics();

		await admin.disconnect();

		response.json({ topics: data });
	} catch (error) {
		response.json({ error: error instanceof Error ? error.message : 'Unexpected error' })
	}
}

export const sendMessage = async (request: Request, response: Response) => {
	try {
		const { key, value, topic } = request.body;
		const producer = kafka.producer();

		await producer.connect();

		await producer.send({
			topic: topic,
			messages: [
				{ key: key, value: value }
			],
			acks: -1
		});

		response.json({ response: `Message sent successfully to topic ${topic}` })
	} catch (error) {
		response.json({ error: error instanceof Error ? error.message : 'Unexpected error' })
	}
}

export const describeCluster = async (request: Request, response: Response) => {
	try {
		const admin = kafka.admin();
		const data = await admin.describeCluster()

		await admin.disconnect();

		response.json({ topics: data });
	} catch (error) {
		response.json({ error: error instanceof Error ? error.message : 'Unexpected error' })
	}
}

export const describeConfigs = async (request: Request, response: Response) => {
	try {
		const admin = kafka.admin();
		const data = await admin.describeConfigs({
			includeSynonyms: false,
			resources: [
			  {
				type: ConfigResourceTypes.TOPIC,
				name: 'abc'
			  }
			]
		  })

		await admin.disconnect();

		response.json({ topics: data });
	} catch (error) {
		response.json({ error: error instanceof Error ? error.message : 'Unexpected error' })
	}
}