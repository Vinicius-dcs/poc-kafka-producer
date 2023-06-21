import { Router } from 'express';
import * as KafkaController from './KafkaController';

const router = Router();

router.get('/list-created-topics', KafkaController.listCreatedTopics);
router.get('/describe-cluster', KafkaController.describeCluster);
router.get('/describe-configs', KafkaController.describeConfigs);
router.post('/create-topic', KafkaController.createTopic);
router.post('/send-message', KafkaController.sendMessage);

export default router;