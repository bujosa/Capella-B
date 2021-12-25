// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

async function pubsubStart(
  projectId = "your-project-id", // Your Google Cloud Platform project ID
  topicName = "my-topic", // Name for the new topic to create
  subscriptionName = "my-sub" // Name for the new subscription to create
) {
  // Instantiates a client
  const pubsub = new PubSub({
    projectId,
    apiEndpoint: process.env.PUB_SUB_API_ENDPOINT,
  });

  // Creates a new topic
  const [topic] = await pubsub.createTopic(topicName);
  console.log(`Topic ${topic.name} created.`);

  // Creates a subscription on that new topic
  const [subscription] = await topic.createSubscription(subscriptionName);

  // Receive callbacks for new messages on the subscription
  subscription.on("message", (message) => {
    console.log("Received message:", message.data.toString());
    process.exit(0);
  });

  // Receive callbacks for errors on the subscription
  subscription.on("error", (error) => {
    console.error("Received error:", error);
    process.exit(1);
  });

  // Send a message to the topic
  topic.publish(Buffer.from("Test message!"));
}
// [END pubsub_quickstart_create_topic]

process.on("unhandledRejection", (err) => {
  console.error(err.message);
  process.exitCode = 1;
});

pubsubStart(...process.argv.slice(2));
