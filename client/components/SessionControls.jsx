import { useState } from "react";
import { CloudLightning, CloudOff, MessageSquare, Key } from "react-feather";
import Button from "./Button";

function SessionStopped({ startSession, apiKey, setApiKey, isKeyValid }) {
  const [isActivating, setIsActivating] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  function handleStartSession() {
    if (isActivating) return;

    setIsActivating(true);
    startSession().finally(() => {
      setIsActivating(false);
    });
  }

  function handleSaveKey() {
    setApiKey(tempApiKey);
    setShowKeyInput(false);
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      {showKeyInput ? (
        <div className="flex items-center gap-2 w-full">
          <input
            type="password"
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="Enter your OpenAI API key"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveKey();
            }}
          />
          <Button onClick={handleSaveKey} className="bg-green-600">
            Save
          </Button>
          <Button onClick={() => setShowKeyInput(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleStartSession}
            className={isActivating ? "bg-gray-600" : "bg-red-600"}
            icon={<CloudLightning height={16} />}
            disabled={!isKeyValid}
          >
            {isActivating ? "starting session..." : "start session"}
          </Button>
          <Button
            onClick={() => setShowKeyInput(true)}
            icon={<Key height={16} />}
            className="bg-blue-600"
          >
            {apiKey ? "change API key" : "set API key"}
          </Button>
        </div>
      )}
    </div>
  );
}

function SessionActive({ stopSession, sendTextMessage }) {
  const [message, setMessage] = useState("");

  function handleSendClientEvent() {
    sendTextMessage(message);
    setMessage("");
  }

  return (
    <div className="flex items-center justify-center w-full h-full gap-4">
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter" && message.trim()) {
            handleSendClientEvent();
          }
        }}
        type="text"
        placeholder="send a text message..."
        className="border border-gray-200 rounded-full p-4 flex-1"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        onClick={() => {
          if (message.trim()) {
            handleSendClientEvent();
          }
        }}
        icon={<MessageSquare height={16} />}
        className="bg-blue-400"
      >
        send text
      </Button>
      <Button onClick={stopSession} icon={<CloudOff height={16} />}>
        disconnect
      </Button>
    </div>
  );
}

export default function SessionControls({
  startSession,
  stopSession,
  sendClientEvent,
  sendTextMessage,
  events,
  isSessionActive,
  apiKey,
  setApiKey,
  isKeyValid,
}) {
  return isSessionActive ? (
    <SessionActive
      stopSession={stopSession}
      sendTextMessage={sendTextMessage}
    />
  ) : (
    <SessionStopped
      startSession={startSession}
      apiKey={apiKey}
      setApiKey={setApiKey}
      isKeyValid={isKeyValid}
    />
  );
}
