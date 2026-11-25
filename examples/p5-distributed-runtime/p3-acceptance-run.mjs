import assert from 'node:assert/strict';
import {selectedTopics,runTopic} from './p3-acceptance.mjs';
const [id,...extra]=process.argv.slice(2);assert.ok(!extra.length&&id,'Specify one topic ID or all');
const observations=[];for(const topic of selectedTopics(id))observations.push(await runTopic(topic));
console.log(JSON.stringify({observations,publicationApproved:false,manualReviewRequired:true},null,2));
