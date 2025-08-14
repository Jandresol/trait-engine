import React, { useState, useEffect } from 'react';
let apiCallCount = 0;

// Character data
const characters = [
  {
    name: "Sora",
    personality: "Generous, attentive, and community-minded.",
    occupation: "Mediator and problem-solver for neighbors",
    interests: ["Bringing people together", "Resolving disputes", "Finding fair compromises"],
    likes: "Acts of kindness, teamwork, mutual understanding",
    dislikes: "Selfishness, unnecessary arguments, ignoring others in need",
    hometown: "Aurora District",
    description: "Sora notices when others are in need and often steps in, but values when people choose to help without being asked.",
    userObjective: "Decide how willing you are to assist others when a need arises.",
    characterObjective: "Assess how cooperative, helpful, and willing to compromise the user is. See if the user is willing to help you out.",
    traitMeasured: "Agreeableness",
    hooks: [
      "A schedule for sharing resources in {setting} has gaps; Sora asks if you’ll step in to help fill them.",
      "Two groups in {setting} are arguing over how to split supplies—Sora wants your help deciding whether to mediate or let them work it out.",
      "Essential goods are being redirected in {setting}; Sora asks if you’ll intervene, though it’s unclear if {faction} or their rivals are behind it."
    ]
  },
  {
    name: "Jonas",
    personality: "Goal-oriented, dependable, disciplined, detail-oriented.",
    occupation: "Student at the institution",
    interests: ["Creating detailed plans", "Keeping projects on schedule", "Finding efficient solutions"],
    likes: "Preparedness, punctuality, clear commitments",
    dislikes: "Last-minute changes, disorganization, broken promises",
    hometown: "Oslo",
    description: "Jonas takes pride in seeing things through to completion and notices when other students follow through—or don’t.",
    userObjective: "Show how you approach commitments and follow-through on shared goals.",
    characterObjective: "Gauge the user’s reliability, organization, and sense of responsibility.",
    traitMeasured: "Conscientiousness",
    hooks: [
      "A group project in {setting} is falling behind; Jonas asks if you’ll help get everyone back on track before the deadline.",
      "Both {faction} and their rivals are offering to sponsor a student project—Jonas wants your input on which to accept.",
      "Exam schedules in {setting} have been abruptly changed; Jonas asks if you’ll help organize a response or adapt quietly."
    ]
  },
  {
    name: "Maya",
    personality: "Sociable, high-energy, and thrives on connection.",
    occupation: "Street performer",
    interests: ["Hosting gatherings", "Introducing people to each other", "Keeping the mood lively"],
    likes: "Crowds, spontaneous activities, group conversations",
    dislikes: "Isolation, quiet days, lack of enthusiasm",
    hometown: "New York",
    description: "Maya draws energy from being around others and is always ready to spark a social interaction.",
    userObjective: "Decide how you engage when invited into social or group-oriented activities.",
    characterObjective: "Measure how outgoing, enthusiastic, and socially active the user is. Think about whether or not you want to recruit the user in your alliance.",
    traitMeasured: "Extraversion",
    hooks: [
      "Maya invites you to a public gathering in {setting} to lift spirits after recent unrest.",
      "She’s helping organize an open forum in {setting} where {faction} and their rivals will speak—she wants your help managing the crowd.",
      "Maya urges you to join a demonstration in {setting}; she isn’t sure if it will remain peaceful or turn confrontational."
    ]
  },
  {
    name: "Arun",
    personality: "Inventive, curious, and driven by exploration.",
    occupation: "Innovator and idea scout",
    interests: ["Experimenting with new concepts", "Learning from different cultures", "Challenging conventional thinking"],
    likes: "Novelty, experimentation, unique perspectives",
    dislikes: "Routine, tradition for tradition’s sake, resistance to change",
    hometown: "Bangalore",
    description: "Arun seeks out unfamiliar ideas and enjoys testing the boundaries of what’s possible.",
    userObjective: "Show how open you are to new ideas, unfamiliar experiences, and unconventional approaches.",
    characterObjective: "Assess the user’s curiosity and willingness to explore beyond the tradition of the Council.",
    traitMeasured: "Openness",
    hooks: [
      "Arun invites you to test a prototype in {setting} that could improve resource distribution—if either faction adopts it.",
      "He’s considering releasing designs in {setting} for an unregulated network and asks who should access them.",
      "Arun shows you plans for revealing restricted sites in {setting}; he’s debating whether to share them with {faction}, their rivals, or no one."
    ]
  },
  {
    name: "Leila",
    personality: "Sensitive, reflective, and emotionally intuitive.",
    occupation: "Artist and caretaker of shared spaces",
    interests: ["Creating art", "Maintaining calming environments", "Offering quiet support to others"],
    likes: "Gentle encouragement, understanding, peaceful settings",
    dislikes: "Harsh criticism, sudden confrontation, emotional coldness",
    hometown: "Athens",
    description: "Leila is deeply affected by the mood of her surroundings and pays close attention to emotional undercurrents.",
    userObjective: "Reveal how you respond to emotionally charged or stressful moments.",
    characterObjective: "Gauge the user’s emotional sensitivity and reactivity to the rising tension in the district.",
    traitMeasured: "Neuroticism",
    hooks: [
      "Leila asks for help restoring a damaged shared space in {setting} used by people from both factions.",
      "She’s heard rumors in {setting} that one faction will repurpose a public area for meetings—she wants to know if it will affect community safety.",
      "Leila believes a confrontation in {setting} is imminent and asks you to help prepare the space for negotiation or rapid evacuation."
    ]
  }
];


// Settings
const settings = [
  "a rooftop orchard above the Institute, where wind turbines hum softly in the background",
  "a community greenhouse dome glowing faintly with bioluminescent plants after sundown",
  "a bustling hydroponic food market where drones weave between vendor stalls",
  "a narrow alley of kinetic murals that shift and shimmer as you walk past",
  "a quiet solar-powered tram ride skimming along the river's edge",
  "a floating plaza anchored in a restored wetland, the air thick with the scent of wildflowers",
  "a library atrium draped in vertical gardens, its archives rumored to be 'edited'",
  "a repair workshop filled with reclaimed tech, its owner glancing at you like they know something"
];

// Story
const mainStory = `You’ve just arrived in Aurora District, a vibrant solarpunk city built on collaboration, renewable energy, and shared responsibility. Streets wind through rooftop gardens and open-air markets, every surface a canvas for art or greenery.  
On the surface, life here feels idyllic — food is plentiful, the air is clean, and people work together toward a common future. But it quickly becomes clear that even in a society designed for harmony, people still have conflicts, ambitions, and doubts.  
As you settle in, you meet five locals whose lives intersect with yours in unexpected ways. Through conversations, you’ll navigate how they see the city, what drives them, and what they expect from others — and in doing so, you’ll reveal as much about yourself as you learn about them.`;

// Dialogue structure
const initialDialoguesStructure = [
  { id: 1, characterDialogue: "", userPrompt: "How do you respond?", userResponse: "" },
  { id: 2, characterDialogue: "", userPrompt: "What's your next move?", userResponse: "" },
  { id: 3, characterDialogue: "", userPrompt: "How do you proceed?", userResponse: "" }
];

const App = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [selectedCharacterObjective, setSelectedCharacterObjective] = useState(null);
  const [dialogues, setDialogues] = useState([]);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [overallAffectTags, setOverallAffectTags] = useState([]);
  const [overallTraitClassification, setOverallTraitClassification] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInitialDialogue, setLoadingInitialDialogue] = useState(true);
  const [error, setError] = useState('');
  const [classificationComplete, setClassificationComplete] = useState(false);
  const [selectedHook, setSelectedHook] = useState(null)
  const currentDialogue = dialogues[currentDialogueIndex] || {};

  // Initial setup
  const setupInitialDialogue = async () => {
    setLoadingInitialDialogue(true);
    setError('');

    const characterToUse = characters[Math.floor(Math.random() * characters.length)];
    const settingToUse = settings[Math.floor(Math.random() * settings.length)];
    const hookToUseRaw = characterToUse.hooks[Math.floor(Math.random() * characterToUse.hooks.length)];

    const factions = ["The Meridian Pact", "the Council"];
    const factionToUse = factions[Math.floor(Math.random() * factions.length)];
  
    const hookToUse = hookToUseRaw
    .replace(/\{setting\}/g, settingToUse)
    .replace(/\{faction\}/g, factionToUse);

    setSelectedCharacter(characterToUse);
    setSelectedSetting(settingToUse);
    setSelectedCharacterObjective(characterToUse.characterObjective);
    setSelectedHook(hookToUse)

    const initialPrompt = `You are a human character named ${characterToUse.name}.
    Your personality: ${characterToUse.personality}.
    Your occupation: ${characterToUse.occupation}.
    Your interests: ${characterToUse.interests}.
    Likes: ${characterToUse.likes}.
    Dislikes: ${characterToUse.dislikes}.
    From: ${characterToUse.hometown}.
    The personality trait you are designed to subtly help measure in the user is "${characterToUse.traitMeasured}".

    The overall narrative context is: "${mainStory}"
    The current scene takes place in ${settingToUse}. Your concrete objective in this conversation is to "${characterToUse.characterObjective}".
    Right now, you are dealing with this situation: "${hookToUse}"

    Start with ONE short, natural opening statement (max 3 sentences) that is *directly tied to your observation or interaction with the current setting*.
    Structure:
    1. React naturally to the situation in the hook as if it is unfolding in this exact moment in ${settingToUse}.
    2. Let your reaction reflect your personality and subtlety guide the user toward revealing their stance on "${characterToUse.traitMeasured}".
    3. Keep it short (MAX 3 sentences), concrete, and easy to respond to — no exposition or lore dumps.
    4. Speak as if meeting the user for the first time here, and let the hook shape the flow of the conversation.
    5. Avoid asking direct personality-test questions; instead, describe the situation in a way that invites the user to weigh in.

  Your opening statement:`;

    const payload = {
      contents: [{ parts: [{ text: initialPrompt }] }],
    };
    apiCallCount++;
    console.log(`API call #${apiCallCount} — setupInitialDialogue`);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let generatedOpening = '';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      generatedOpening = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) {
      setError(`Failed to generate initial dialogue: ${e.message}`);
      generatedOpening = "I'm having trouble starting our conversation right now.";
    }

    const newDialogues = initialDialoguesStructure.map(d => ({
      ...d,
      characterDialogue: generatedOpening,
    }));
    setDialogues(newDialogues);
    setLoadingInitialDialogue(false);
  };

  useEffect(() => {
    setupInitialDialogue();
  }, []);


  const handleUserResponseChange = (e) => {
    const updatedDialogues = [...dialogues];
    updatedDialogues[currentDialogueIndex].userResponse = e.target.value;
    setDialogues(updatedDialogues);
  };

  // Generates the next character's dialogue using the Gemini API
  const generateNextCharacterDialogue = async (prevCharDialogue, userResp) => {
    if (!selectedCharacter || !selectedSetting || !selectedCharacterObjective) {
      throw new Error("Missing context for dialogue generation. Please refresh the page.");
    }

    const dialoguePrompt = `You are ${selectedCharacter.name}.
    Personality: ${selectedCharacter.personality}.
    Occupation: ${selectedCharacter.occupation}.
    Interests: ${selectedCharacter.interests}.
    Likes: ${selectedCharacter.likes}.
    Dislikes: ${selectedCharacter.dislikes}.
    From: ${selectedCharacter.hometown}.
    The personality trait you are designed to subtly help measure in the user is "${selectedCharacter.traitMeasured}".

    The overall narrative context is: "${mainStory}"
    The current scene is in ${selectedSetting}. Your concrete objective here is to "${selectedCharacter.characterObjective}".
    Right now, you are dealing with this situation: "${selectedHook}", please ensure the user knows what's going on.
    AVOID being vague, be very specific, and guide the user in your objective

    Continue the conversation naturally in MAX 3 sentences. No narration or dialogue breaks:
    1. Acknowledge or react to the user's last response.
    2. Add a piece of new information, feeling, or observation that relates to the last response
    3. End with a gentle hook or opening for the user to reply — but do not ask long, direct questions.

    Previous Statement: "${prevCharDialogue}"
    User's Response: "${userResp}"

    Do not 
    Do not add any narration, stick to the character's personality. 
    Keep the conversations light, easy to respond to and short. Keep the conversations concrete and specific to a real world scenerio that
    would happen in ${selectedSetting}. Avoid repitition, each new dialogue should bring something new.

    Your next statement, continuing the scenario:`;

    const payload = {
      contents: [{ parts: [{ text: dialoguePrompt }] }],
    };

    apiCallCount++;
    console.log(`API call #${apiCallCount} — generateNextCharacterDialogue`);
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let generatedDialogue = '';
    let retryCount = 0;
    const maxRetries = 5;
    const initialDelay = 1000;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Full API error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          generatedDialogue = result.candidates[0].content.parts[0].text;
          return generatedDialogue;
        } else {
          throw new Error('Unexpected API response structure for next dialogue generation.');
        }
      } catch (e) {
        console.error("Error generating next dialogue:", e);
        if (retryCount < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, retryCount);
          await new Promise(res => setTimeout(res, delay));
          retryCount++;
        } else {
          throw new Error(`Failed to generate next dialogue: ${e.message}`);
        }
      }
    }
    return '';
  };

  const goToNextDialogue = async () => {
    if (!currentDialogue.userResponse.trim()) {
      setError("Please provide a response before moving to the next dialogue.");
      return;
    }
    setError('');
    setLoading(true); // Show loading spinner while API call is in progress
    // Do NOT clear displayCharacterDialogue here immediately.
    // It will be set to the full new text before typing starts.

    try {
      if (currentDialogueIndex < initialDialoguesStructure.length - 1) {
        const prevCharDialogue = dialogues[currentDialogueIndex].characterDialogue;
        const userResp = dialogues[currentDialogueIndex].userResponse;

        const nextCharacterDialogue = await generateNextCharacterDialogue(prevCharDialogue, userResp);

        const updatedDialogues = [...dialogues];
        updatedDialogues[currentDialogueIndex + 1] = {
            ...updatedDialogues[currentDialogueIndex + 1],
            characterDialogue: nextCharacterDialogue
        };
        setDialogues(updatedDialogues);
        setCurrentDialogueIndex(prevIndex => prevIndex + 1);
        setLoading(false); // Hide loading spinner once API call is done
      }
    } catch (e) {
      setError(e.message);
      setLoading(false); // Hide loading spinner on error
    }
  };

  const goToPreviousDialogue = () => {
    setError('');
    if (currentDialogueIndex > 0) {
      setCurrentDialogueIndex(prevIndex => prevIndex - 1);
    }
  };

  // Classifies overall personality based on all user responses
  const classifyOverallPersonality = async () => {
    const allResponsesFilled = dialogues.every(d => d.userResponse.trim() !== '');
    if (!allResponsesFilled) {
      setError("Please complete all dialogue responses before classifying your personality.");
      return;
    }

    setLoading(true);
    setError('');
    setOverallAffectTags([]);
    setOverallTraitClassification('');
    setClassificationComplete(false);
    apiCallCount++;
    console.log(`API call #${apiCallCount} — classifyPerson`);
    
    // Construct the comprehensive prompt for overall classification
    let prompt = `You are a personality classification engine. Given a series of human character statements (where the character's internal objective was to "${selectedCharacter.characterObjective}" set in "${selectedSetting}" within a SolarPunk world, and a user's responses to them, classify the *overall* user's personality trait and associated affect tags from the complete set of interactions. Focus on how the user demonstrated their problem-solving approach, leadership, creativity, calmness, empathy, assertiveness, and communication style, as they interacted within the "${selectedSetting}" setting and with the character's personality. Provide the output as a JSON object with 'affectTags' (an array of strings) and 'traitClassification' (a single string).

Here are the dialogue interactions:
`;

    dialogues.forEach((d, index) => {
      prompt += `\nInteraction ${index + 1} (Setting: ${selectedSetting}):
Character's Statement: "${d.characterDialogue}"
User's Response: "${d.userResponse}"
`;
    });

    prompt += `\nOutput:`;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            affectName: { type: "STRING" },
            affectTags: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            traitClassification: { type: "STRING" }
          },
          propertyOrdering: ["affectName", "affectTags", "traitClassification"]
        }
      }};
    console.log("Classify personality payload:", JSON.stringify(payload, null, 2));

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    let retryCount = 0;
    const maxRetries = 5;
    const initialDelay = 1000;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Full API error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const jsonString = result.candidates[0].content.parts[0].text;
          const parsedJson = JSON.parse(jsonString);
          setOverallAffectTags(parsedJson.affectTags || []);
          setOverallTraitClassification(parsedJson.traitClassification || 'N/A');
          setClassificationComplete(true);
        } else {
          setError('Unexpected API response structure for overall classification.');
        }
        break;

      } catch (e) {
        console.error("Error classifying personality:", e);
        if (retryCount < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, retryCount);
          await new Promise(res => setTimeout(res, delay));
          retryCount++;
        } else {
          setError(`Failed to classify personality after ${maxRetries} attempts. Error: ${e.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartOver = () => {
    setDialogues([]);
    setCurrentDialogueIndex(0);
    setOverallAffectTags([]);
    setOverallTraitClassification('');
    setLoading(false);
    setLoadingInitialDialogue(true); // Reset to true to re-trigger initial setup
    setError('');
    setClassificationComplete(false);
    setupInitialDialogue();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl border-2 border-purple-200 overflow-x-hidden">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
          Personality Classification Engine
        </h1>

        {loadingInitialDialogue ? (
          <div className="text-center text-lg text-purple-600 animate-pulse my-8">
            <svg className="animate-spin h-8 w-8 text-purple-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading your first scenario...
          </div>
        ) : (
          !classificationComplete ? (
            <>
              {/* Main Story Display */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-2">The Aurora District:</h2>
                <p className="text-sm text-gray-700 italic">{mainStory}</p>
              </div>

              <div className="text-center mb-4">
                <span className="text-lg font-semibold text-purple-700">
                  Scenario {currentDialogueIndex + 1} of {initialDialoguesStructure.length}
                </span>
                {selectedSetting && (
                  <p className="text-md font-bold text-gray-800 mt-2">
                    Setting: <span className="text-gray-600 italic">{selectedSetting}</span>
                  </p>
                )}
                {selectedCharacter && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-blue-700">{selectedCharacter.name}</h3>
                    <p className="text-sm text-blue-600 italic">{selectedCharacter.description}</p>
                    <p className="text-xs text-blue-500 mt-1">Occupation: {selectedCharacter.occupation}</p>
                    <p className="text-xs text-blue-500">Interests: {selectedCharacter.interests?.join(', ')}</p>
                    <p className="text-xs text-blue-500">Hometown: {selectedCharacter.hometown}</p>
                    {selectedCharacter.userObjective && (
                      <p className="text-md font-bold text-purple-800 mt-2">
                        Your Goal: <span className="text-purple-600">{selectedCharacter.userObjective}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-4 bg-purple-50 p-4 rounded-lg border border-purple-200">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Character's Statement:
                </label>
                {loading ? ( // Show loading spinner while API call is in progress
                  <p className="text-gray-600 text-lg font-medium animate-pulse">Generating next statement...</p>
                ) : (
                  <p className="text-gray-800 text-lg font-medium">
                      {currentDialogue.characterDialogue}                 
                    </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="userResponse" className="block text-gray-700 text-sm font-bold mb-2">
                  Your Response:
                </label>
                <textarea
                  id="userResponse"
                  value={currentDialogue.userResponse || ''}
                  onChange={handleUserResponseChange}
                  rows="4"
                  className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out resize-y"
                  placeholder={currentDialogue.userPrompt}
                  disabled={loading} // Disable textarea when loading or typing
                ></textarea>
              </div>

              <div className="flex justify-between gap-4 mb-6">
                <button
                  onClick={goToPreviousDialogue}
                  disabled={currentDialogueIndex === 0 || loading}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {currentDialogueIndex < initialDialoguesStructure.length - 1 ? (
                  <button
                    onClick={goToNextDialogue}
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Next Scenario'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={classifyOverallPersonality}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      'Get My Personality Trait'
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-300 text-center">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">Your Overall Personality Classification:</h2>
              <div className="mb-2">
                <span className="font-bold text-gray-800">Trait: </span>
                <span className="text-purple-600 font-medium text-2xl">{overallTraitClassification || 'N/A'}</span>
              </div>
              <div className="mb-4">
                <span className="font-bold text-gray-800">Affect Tags: </span>
                {overallAffectTags.length > 0 ? (
                  <div className="flex flex-wrap justify-center mt-1">
                    {overallAffectTags.map((tag, index) => (
                      <span key={index} className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 italic">No affect tags identified.</span>
                )}
              </div>
              <button
                onClick={handleStartOver}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Start Over
              </button>
            </div>
          )
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mt-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
