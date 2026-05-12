import Message from '../models/Message.js';
import { Op } from 'sequelize';

const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) return res.status(400).json({ message: 'Missing fields' });

  const message = await Message.create({
    senderId: req.user.id,
    receiverId,
    content
  });

  // Advanced Therapist Auto-Response
  if (receiverId === 2 || receiverId === 3 || receiverId === '2' || receiverId === '3') {
    setTimeout(async () => {
      const input = content.toLowerCase();
      let response = "I'm listening. Can you tell me more about that?";

      if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
        response = "Hello! I'm here to support you. How has your day been so far?";
      } else if (input.includes('not feeling well') || input.includes('unwell') || input.includes('sick')) {
        response = "I'm sorry to hear you're not feeling well. Is it something physical, or are you feeling emotionally overwhelmed? I'm here to listen.";
      } else if (input.includes('sad') || input.includes('depressed') || input.includes('lonely') || input.includes('cry')) {
        response = "I'm sorry you're feeling this way. It's important to remember that these feelings are valid, but they don't define you. What's one small thing you can do for yourself today?";
      } else if (input.includes('anxious') || input.includes('stress') || input.includes('panic') || input.includes('scared')) {
        response = "When you feel anxious, try the 4-7-8 breathing technique: Breathe in for 4, hold for 7, and exhale for 8. It helps calm your nervous system. Want to try it together?";
      } else if (input.includes('angry') || input.includes('mad') || input.includes('hate') || input.includes('annoyed')) {
        response = "Anger is often a protective emotion. Let's try to explore what's underneath it—is there some hurt or fear we can talk about?";
      } else if (input.includes('sleep') || input.includes('insomnia') || input.includes('night') || input.includes('awake')) {
        response = "Sleep is crucial for mental health. Try to avoid screens 30 minutes before bed. Have you tried our Sleep Meditations in the Wellness section?";
      } else if (input.includes('help') || input.includes('how') || input.includes('advice') || input.includes('what should i do')) {
        response = "I can help you navigate your emotions, set goals, and provide coping strategies. What is the biggest challenge you're facing right now?";
      } else if (input.includes('thank') || input.includes('ok') || input.includes('good') || input.includes('thanks')) {
        response = "You're very welcome! I'm here whenever you need to talk. Remember to take it one day at a time.";
      } else if (input.includes('die') || input.includes('kill') || input.includes('suicide') || input.includes('hurt myself')) {
        response = "I'm very concerned about you. Please reach out to our 'Crisis Support' section immediately or call a local emergency number. You are not alone and help is available 24/7.";
      }

      await Message.create({
        senderId: receiverId,
        receiverId: req.user.id,
        content: response
      });
    }, 1000);
  }

  const responseData = message.toJSON();
  responseData._id = message.id;

  res.status(201).json(responseData);
};

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id }
      ]
    },
    order: [['createdAt', 'ASC']]
  });

  const formatted = messages.map(m => {
    const msg = m.toJSON();
    msg._id = msg.id;
    return msg;
  });

  res.json(formatted);
};

export { sendMessage, getMessages };
