import json
import torch
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
from datasets import Dataset
from sklearn.metrics import accuracy_score

# Load the JSON data
with open('emotion-categories.json', 'r') as file:
    emotion_data = json.load(file)

# Prepare the data for BERT
def prepare_data(emotion_data):
    texts = []
    labels = []
    label_map = {emotion: idx for idx, emotion in enumerate(emotion_data.keys())}

    for emotion, intensities in emotion_data.items():
        for intensity, words in intensities.items():
            for word in words:
                texts.append(word)
                labels.append(label_map[emotion])

    return texts, labels, label_map

texts, labels, label_map = prepare_data(emotion_data)

# Split the data into training and testing sets
train_texts, test_texts, train_labels, test_labels = train_test_split(texts, labels, test_size=0.2, random_state=42)

# Load the BERT tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Tokenize the data
train_encodings = tokenizer(train_texts, truncation=True, padding=True)
test_encodings = tokenizer(test_texts, truncation=True, padding=True)

# Convert data to torch Dataset
train_dataset = Dataset.from_dict({
    'input_ids': train_encodings['input_ids'],
    'attention_mask': train_encodings['attention_mask'],
    'labels': train_labels
})
test_dataset = Dataset.from_dict({
    'input_ids': test_encodings['input_ids'],
    'attention_mask': test_encodings['attention_mask'],
    'labels': test_labels
})

# Load the pre-trained BERT model for sequence classification
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=len(label_map))

# Define training arguments
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
    evaluation_strategy="steps",
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
)

# Fine-tune the model
trainer.train()

# Save the fine-tuned model
model.save_pretrained('fine-tuned-bert')
tokenizer.save_pretrained('fine-tuned-bert')

# Evaluate the model
eval_results = trainer.evaluate()

# Get predictions
predictions = trainer.predict(test_dataset)
predicted_labels = predictions.predictions.argmax(-1)

# Calculate accuracy
accuracy = accuracy_score(test_labels, predicted_labels)

print(f"Evaluation results: {eval_results}")
print(f"Accuracy: {accuracy * 100:.2f}%")

# Save the label map
with open('label_map.json', 'w') as f:
    json.dump(label_map, f)
