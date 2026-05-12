import JournalEntry from '../models/JournalEntry.js';

const createEntry = async (req, res) => {
  const { title, content, category, isLocked } = req.body;
  
  if (!content) {
    return res.status(400).json({ message: 'Content is required.' });
  }

  // FYP Feature: Simple Sentiment Analysis
  let sentiment = 'Neutral';
  const negativeWords = ['sad', 'bad', 'awful', 'terrible', 'depressed', 'kill', 'die', 'angry', 'hate', 'alone', 'crying'];
  const positiveWords = ['happy', 'great', 'awesome', 'good', 'joy', 'excited', 'peace', 'calm', 'relaxed'];
  
  const words = content.toLowerCase().split(' ');
  const negCount = words.filter(w => negativeWords.includes(w)).length;
  const posCount = words.filter(w => positiveWords.includes(w)).length;

  if (negCount > posCount) sentiment = 'Negative';
  else if (posCount > negCount) sentiment = 'Positive';

  const entry = await JournalEntry.create({
    userId: req.user.id,
    title,
    content,
    category,
    isLocked,
    sentiment // Store sentiment for analytics
  });

  const responseData = entry.toJSON();
  responseData._id = entry.id;
  responseData.sentimentAnalysis = sentiment;

  res.status(201).json(responseData);
};

const getEntries = async (req, res) => {
  const entries = await JournalEntry.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']]
  });

  const formatted = entries.map(e => {
    const entry = e.toJSON();
    entry._id = entry.id;
    return entry;
  });

  res.json(formatted);
};

const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, isLocked } = req.body;

  const entry = await JournalEntry.findOne({ where: { id, userId: req.user.id } });
  if (!entry) return res.status(404).json({ message: 'Entry not found' });

  entry.title = title || entry.title;
  entry.content = content || entry.content;
  entry.category = category || entry.category;
  entry.isLocked = isLocked !== undefined ? isLocked : entry.isLocked;

  await entry.save();
  const responseData = entry.toJSON();
  responseData._id = entry.id;
  res.json(responseData);
};

const deleteEntry = async (req, res) => {
  const { id } = req.params;
  const entry = await JournalEntry.findOne({ where: { id, userId: req.user.id } });
  if (!entry) return res.status(404).json({ message: 'Entry not found' });

  await entry.destroy();
  res.json({ message: 'Entry deleted' });
};

export { createEntry, getEntries, updateEntry, deleteEntry };
