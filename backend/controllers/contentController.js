import WellnessContent from '../models/WellnessContent.js';

// @desc    Get all wellness content
// @route   GET /api/content
// @access  Private
const getContent = async (req, res) => {
  let content = await WellnessContent.findAll();
  
  // If no content, seed some data for demo purposes
  if (content.length === 0) {
      const seedData = [
          { title: 'Understanding Anxiety', type: 'Article', content: 'Anxiety is a normal emotion. It is your brain\'s way of reacting to stress and alerting you of potential danger ahead. Recognizing it is the first step to managing it.', duration: '3 mins', tags: ['Anxiety', 'Education'] },
          { title: '5-Minute Box Breathing', type: 'Exercise', content: 'Breathe in for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat for 5 minutes to activate your parasympathetic nervous system.', duration: '5 mins', tags: ['Breathing', 'Stress'] },
          { title: 'Guided Sleep Meditation', type: 'Audio', content: 'Focus on your breath. Let go of all the thoughts from your day. Progressively relax every muscle in your body starting from your toes.', duration: '10 mins', tags: ['Sleep', 'Meditation'] },
      ];
      await WellnessContent.bulkCreate(seedData);
      content = await WellnessContent.findAll();
  }

  const formatted = content.map(c => {
    const item = c.toJSON();
    item._id = item.id;
    return item;
  });

  res.json(formatted);
};

export { getContent };
