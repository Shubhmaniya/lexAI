export default function ChatBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-accent text-white rounded-2xl rounded-tr-sm'
          : 'bg-secondary text-white rounded-2xl rounded-tl-sm border border-border'
      }`}>
        {content}
      </div>
    </div>
  );
}
