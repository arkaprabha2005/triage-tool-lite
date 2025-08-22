import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone, MapPin, Home, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type Symptom = {
  id: string;
  name: string;
  icon: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  isRedFlag?: boolean;
};

export type Result = {
  level: "emergency" | "urgent" | "clinic" | "selfcare";
  title: string;
  description: string;
  actions: string[];
};

const symptoms: Symptom[] = [
  {
    id: "fever",
    name: "Fever",
    icon: "🌡️",
    questions: [
      { id: "fever-high", text: "Is your temperature over 103°F (39.4°C)?", isRedFlag: true },
      { id: "fever-breathing", text: "Are you having trouble breathing or shortness of breath?", isRedFlag: true },
      { id: "fever-confusion", text: "Are you feeling confused, disoriented, or unusually drowsy?", isRedFlag: true },
      { id: "fever-rash", text: "Do you have a purple or red rash that doesn't fade when pressed?", isRedFlag: true },
      { id: "fever-severe-headache", text: "Do you have severe headache with neck stiffness or light sensitivity?" },
      { id: "fever-vomiting", text: "Are you unable to keep fluids down due to persistent vomiting?" },
      { id: "fever-duration", text: "Have you had fever for more than 3 days?" },
      { id: "fever-chills", text: "Are you experiencing severe chills or shaking?" },
      { id: "fever-dehydration", text: "Are you showing signs of dehydration (dizziness, dry mouth, little/no urination)?" },
      { id: "fever-activities", text: "Is the fever preventing you from normal daily activities?" }
    ]
  },
  {
    id: "cough",
    name: "Cough",
    icon: "🤧",
    questions: [
      { id: "cough-breathing", text: "Are you having severe difficulty breathing or can't catch your breath?", isRedFlag: true },
      { id: "cough-blood", text: "Are you coughing up blood or pink/bloody phlegm?", isRedFlag: true },
      { id: "cough-chest-pain", text: "Do you have severe, sharp chest pain that worsens with breathing?", isRedFlag: true },
      { id: "cough-blue-lips", text: "Are your lips, face, or fingernails turning blue?", isRedFlag: true },
      { id: "cough-high-fever", text: "Do you have a high fever (over 101°F) with the cough?" },
      { id: "cough-wheezing", text: "Are you wheezing or making whistling sounds when breathing?" },
      { id: "cough-persistent", text: "Has the cough lasted more than 2 weeks?" },
      { id: "cough-night", text: "Is the cough keeping you awake at night?" },
      { id: "cough-thick-mucus", text: "Are you coughing up thick, colored mucus (yellow, green, or brown)?" },
      { id: "cough-talking", text: "Is it difficult to speak in full sentences due to coughing?" },
      { id: "cough-activities", text: "Does the cough prevent you from normal activities or exercise?" }
    ]
  },
  {
    id: "headache",
    name: "Headache",
    icon: "🤕",
    questions: [
      { id: "headache-sudden", text: "Did the headache start suddenly and is it the worst you've ever had?", isRedFlag: true },
      { id: "headache-vision", text: "Are you experiencing vision changes, confusion, or difficulty speaking?", isRedFlag: true },
      { id: "headache-neck", text: "Do you have neck stiffness that prevents you from touching chin to chest?", isRedFlag: true },
      { id: "headache-fever-rash", text: "Do you have fever with headache and a rash?", isRedFlag: true },
      { id: "headache-weakness", text: "Do you have weakness, numbness, or tingling in arms/legs?" },
      { id: "headache-nausea", text: "Are you experiencing severe nausea and vomiting with the headache?" },
      { id: "headache-light", text: "Does light or noise make your headache much worse?" },
      { id: "headache-frequent", text: "Are you having headaches more than 3 times per week?" },
      { id: "headache-medication", text: "Are you taking pain medication for headaches more than 2 days per week?" },
      { id: "headache-sleep", text: "Is the headache affecting your sleep or waking you up?" },
      { id: "headache-pattern", text: "Has your headache pattern changed significantly recently?" }
    ]
  },
  {
    id: "stomach",
    name: "Stomach Pain",
    icon: "🤮",
    questions: [
      { id: "stomach-severe", text: "Is the pain severe, constant, and prevents you from moving normally?", isRedFlag: true },
      { id: "stomach-blood", text: "Are you vomiting blood, coffee-ground material, or having bloody/black stools?", isRedFlag: true },
      { id: "stomach-rigid", text: "Is your abdomen rigid or board-like when touched?", isRedFlag: true },
      { id: "stomach-signs", text: "Do you have signs of severe dehydration (dizziness, no urination, dry mouth)?", isRedFlag: true },
      { id: "stomach-high-fever", text: "Do you have high fever (over 101°F) with abdominal pain?" },
      { id: "stomach-location", text: "Is the pain localized to the lower right side of your abdomen?" },
      { id: "stomach-eating", text: "Are you unable to keep food or liquids down for more than 24 hours?" },
      { id: "stomach-bowel", text: "Have you had no bowel movement for more than 3 days with pain?" },
      { id: "stomach-duration", text: "Has the pain been constant for more than 6 hours?" },
      { id: "stomach-movement", text: "Does movement, coughing, or walking make the pain much worse?" },
      { id: "stomach-appetite", text: "Have you completely lost your appetite for more than 2 days?" }
    ]
  },
  {
    id: "injury",
    name: "Minor Injury",
    icon: "🩹",
    questions: [
      { id: "injury-bleeding", text: "Is there uncontrolled bleeding that won't stop with direct pressure?", isRedFlag: true },
      { id: "injury-bone", text: "Do you suspect a broken bone or can you see bone through the wound?", isRedFlag: true },
      { id: "injury-head", text: "Did you hit your head and are now confused, nauseous, or have vision changes?", isRedFlag: true },
      { id: "injury-circulation", text: "Is the injured area cold, blue, or numb indicating poor circulation?", isRedFlag: true },
      { id: "injury-deep", text: "Is the cut deep enough that you can see fat, muscle, or it won't stay closed?" },
      { id: "injury-movement", text: "Are you unable to move the injured area normally?" },
      { id: "injury-swelling", text: "Is there significant swelling that's getting worse?" },
      { id: "injury-pain", text: "Is the pain severe and not relieved by over-the-counter pain medication?" },
      { id: "injury-infection", text: "Are there signs of infection (red streaks, pus, warm to touch, fever)?" },
      { id: "injury-mechanism", text: "Was this a high-impact injury (fall from height, car accident, sports collision)?" },
      { id: "injury-function", text: "Is the injury preventing you from normal daily activities?" }
    ]
  }
];

const getResult = (answers: Record<string, boolean>, symptomId: string): Result => {
  const symptom = symptoms.find(s => s.id === symptomId);
  if (!symptom) return {
    level: "selfcare",
    title: "Self-Care Recommended", 
    description: "Unable to assess symptoms properly.",
    actions: ["Consult healthcare provider if symptoms persist"]
  };

  // Count red flag answers
  const redFlagCount = symptom.questions
    .filter(q => q.isRedFlag)
    .filter(q => answers[q.id] === true)
    .length;

  // Count total yes answers
  const yesCount = Object.values(answers).filter(Boolean).length;

  // Emergency if any red flag
  if (redFlagCount > 0) {
    return {
      level: "emergency",
      title: "URGENT: Call Emergency Now",
      description: "Based on your symptoms, you need immediate medical attention.",
      actions: ["Call 911 or your local emergency number immediately", "Do not drive yourself", "Have someone stay with you"]
    };
  }

  // Assess based on total yes answers
  if (yesCount >= 6) {
    return {
      level: "urgent",
      title: "Seek Urgent Care",
      description: "Your symptoms suggest you should be seen by a healthcare provider within 24 hours.",
      actions: ["Visit urgent care or emergency room within 24 hours", "Monitor your symptoms closely", "Call if symptoms worsen"]
    };
  } else if (yesCount >= 3) {
    return {
      level: "clinic",
      title: "Visit Campus Clinic",
      description: "You should schedule an appointment with the campus health center within 1-3 days.",
      actions: ["Make an appointment during business hours", "Rest and stay hydrated", "Monitor your symptoms", "Return if symptoms worsen"]
    };
  } else {
    return {
      level: "selfcare",
      title: "Self-Care Recommended",
      description: "Your symptoms can likely be managed with self-care at home.",
      actions: ["Get plenty of rest", "Stay hydrated", "Use over-the-counter medications as needed", "See a provider if symptoms persist or worsen"]
    };
  }
};

const SymptomChecker: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<"welcome" | "symptoms" | "questions" | "result">("welcome");
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentStep === "questions") {
      setShowQuestion(false);
      const timer = setTimeout(() => setShowQuestion(true), 100);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, currentStep]);

  const handleSymptomSelect = (symptom: Symptom) => {
    setSelectedSymptom(symptom);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentStep("questions");
  };

  const handleAnswer = (answer: boolean) => {
    if (!selectedSymptom) return;

    const currentQuestion = selectedSymptom.questions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    // Always continue to next question (don't stop on red flags)
    if (currentQuestionIndex < selectedSymptom.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, show result
      const finalResult = getResult(newAnswers, selectedSymptom.id);
      setResult(finalResult);
      setCurrentStep("result");
    }
  };

  const handleRestart = () => {
    setCurrentStep("welcome");
    setSelectedSymptom(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setShowQuestion(false);
  };

  const handleEmergencyCall = () => {
    window.location.href = "tel:911";
    toast({
      title: "Calling Emergency Services",
      description: "Connecting you to 911...",
    });
  };

  const handleMapsSearch = () => {
    window.open("https://maps.google.com/?q=campus+health+clinic+near+me", "_blank");
  };

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 text-6xl animate-bounce-gentle">🏥</div>
            <CardTitle className="text-2xl animate-fade-in">Student Health Checker</CardTitle>
            <CardDescription className="animate-fade-in">Quick symptom assessment tool</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0 animate-pulse-slow" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Important Disclaimer</p>
                  <p className="text-muted-foreground">
                    This tool does not provide medical advice. For emergencies, call local emergency services immediately.
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setCurrentStep("symptoms")} 
              className="w-full transition-all duration-300 hover:scale-105" 
              size="lg"
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "symptoms") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <Card className="animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="animate-fade-in">Select Your Primary Symptom</CardTitle>
              <CardDescription className="animate-fade-in">Choose the symptom that concerns you most</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {symptoms.map((symptom, index) => (
                <Button
                  key={symptom.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 transition-all duration-300 hover:scale-105 hover:shadow-md animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleSymptomSelect(symptom)}
                >
                  <span className="text-2xl mr-3 animate-bounce-gentle" style={{ animationDelay: `${index * 200}ms` }}>
                    {symptom.icon}
                  </span>
                  <span className="text-left">{symptom.name}</span>
                </Button>
              ))}
              <Button variant="ghost" onClick={handleRestart} className="w-full mt-4 transition-all duration-300 hover:scale-105">
                <RotateCcw className="h-4 w-4 mr-2" />
                Back to Start
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === "questions" && selectedSymptom) {
    const currentQuestion = selectedSymptom.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / selectedSymptom.questions.length) * 100;
    const answeredQuestions = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl animate-bounce-gentle">{selectedSymptom.icon}</span>
              <div>
                <CardTitle className="text-lg">{selectedSymptom.name}</CardTitle>
                <CardDescription>
                  Question {currentQuestionIndex + 1} of {selectedSymptom.questions.length}
                </CardDescription>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Question Counter Visual */}
            <div className="flex justify-center gap-1 mt-2">
              {selectedSymptom.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < currentQuestionIndex + 1 
                      ? 'bg-primary scale-110' 
                      : 'bg-muted scale-75'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className={`text-center transition-all duration-500 ${showQuestion ? 'animate-fade-in' : 'opacity-0'}`}>
              <p className="text-lg font-medium mb-4 leading-relaxed">
                {currentQuestion.text}
              </p>
              {currentQuestion.isRedFlag && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emergency/10 text-emergency rounded-full text-sm mb-4">
                  <AlertTriangle className="h-3 w-3" />
                  Critical Question
                </div>
              )}
            </div>
            
            {/* Answer Buttons */}
            <div className={`grid grid-cols-2 gap-4 transition-all duration-500 ${showQuestion ? 'animate-scale-in' : 'opacity-0'}`}>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleAnswer(false)}
                className="h-auto py-6 transition-all duration-300 hover:scale-105 hover:bg-muted group"
              >
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
                  <span>No</span>
                </div>
              </Button>
              <Button 
                size="lg" 
                onClick={() => handleAnswer(true)}
                className="h-auto py-6 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Yes</span>
                </div>
              </Button>
            </div>

            {/* Progress Text */}
            <div className="text-center text-sm text-muted-foreground">
              {answeredQuestions} of {selectedSymptom.questions.length} questions answered
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "result" && result) {
    const getResultColor = () => {
      switch (result.level) {
        case "emergency": return "border-emergency bg-emergency/5";
        case "urgent": return "border-warning bg-warning/5";
        case "clinic": return "border-primary bg-primary/5";
        case "selfcare": return "border-success bg-success/5";
        default: return "border-border";
      }
    };

    const getResultIcon = () => {
      switch (result.level) {
        case "emergency": return <Phone className="h-8 w-8 text-emergency animate-pulse-slow" />;
        case "urgent": return <AlertTriangle className="h-8 w-8 text-warning animate-bounce-gentle" />;
        case "clinic": return <MapPin className="h-8 w-8 text-primary" />;
        case "selfcare": return <Home className="h-8 w-8 text-success" />;
      }
    };

    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className={`w-full max-w-md border-2 ${getResultColor()} animate-scale-in`}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {getResultIcon()}
            </div>
            <CardTitle className="text-xl animate-fade-in">{result.title}</CardTitle>
            <CardDescription className="animate-fade-in">{result.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="animate-fade-in">
              <h3 className="font-medium mb-3">Recommended Actions:</h3>
              <ul className="space-y-2">
                {result.actions.map((action, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-muted-foreground flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-primary mt-1 font-bold">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
            
            {result.level === "emergency" && (
              <Button 
                onClick={handleEmergencyCall}
                className="w-full bg-emergency hover:bg-emergency/90 transition-all duration-300 hover:scale-105 animate-pulse-slow"
                size="lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency Now
              </Button>
            )}
            
            {result.level === "clinic" && (
              <Button 
                onClick={handleMapsSearch}
                variant="outline"
                className="w-full transition-all duration-300 hover:scale-105"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Find Campus Clinic
              </Button>
            )}
            
            <Button 
              variant="secondary" 
              onClick={handleRestart} 
              className="w-full mt-4 transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default SymptomChecker;