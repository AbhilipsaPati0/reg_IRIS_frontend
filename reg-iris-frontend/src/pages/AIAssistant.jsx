
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bot,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  FileText,
  LoaderCircle,
} from 'lucide-react'
import './AIAssistant.css'

const API_BASE_URL = (
  import.meta.env.VITE_QNA_API_BASE_URL || 'http://127.0.0.1:8001'
).replace(/\/+$/, '')

const ASK_ENDPOINT = '/api/v1/qna/ask'

const SUGGESTIONS = [
  'Summarize the key regulatory requirements.',
  'Which documents discuss reporting obligations?',
  'What evidence supports this requirement?',
]

export default function AIAssistant() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function askQuestion(value = question) {
    const text = value.trim()

    if (text.length < 3) {
      setError('Please enter a question with at least 3 characters.')
      return
    }

    if (text.length > 1000) {
      setError('Your question must be 1000 characters or fewer.')
      return
    }

    if (loading) return

    setError('')
    setQuestion('')
    setMessages((current) => [
      ...current,
      { role: 'user', content: text },
    ])
    setLoading(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000)

    try {
      const response = await fetch(`${API_BASE_URL}${ASK_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, top_k: 5 }),
        signal: controller.signal,
      })

      const envelope = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error(
            envelope.error?.message ||
              envelope.detail ||
              'Please check your question and try again.'
          )
        }

        if (response.status === 503) {
          throw new Error('Service temporarily unavailable, try again.')
        }

        throw new Error(
          envelope.error?.message ||
            envelope.detail ||
            `Request failed (${response.status}).`
        )
      }

      if (envelope.success === false) {
        throw new Error(
          envelope.error?.message || 'The request could not be completed.'
        )
      }

      const data = envelope.data

      if (!data) {
        throw new Error('The service returned an empty response.')
      }

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          data,
          requestId: envelope.request_id,
        },
      ])
    } catch (err) {
      const message =
        err.name === 'AbortError'
          ? 'This request took too long. Please try again.'
          : err.message || 'Unable to contact the AI service.'

      setError(message)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          error: message,
          requestId: '',
        },
      ])
    } finally {
      clearTimeout(timeoutId)
      setLoading(false)
    }
  }

  return (
    <div className="ai-page">
      <header className="ai-page-header">
        <button
          className="ai-back-button"
          type="button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="ai-title-row">
          <div className="ai-title-icon">
            <Bot size={25} />
          </div>
          <div>
            <h1>Reg IRIS AI Assistant</h1>
            <p>Ask questions about your available regulatory documents.</p>
          </div>
        </div>

        <div className="ai-disclaimer">
          <ShieldCheck size={17} />
          Answers use retrieved document evidence. Always review the cited
          sources before making compliance decisions.
        </div>
      </header>

      <section className="ai-chat-panel">
        <div className="ai-chat-heading">
          <div>
            <span className="ai-eyebrow">DOCUMENT INTELLIGENCE</span>
            <h2>Ask a regulatory question</h2>
          </div>
          <span className="ai-service-label">
            <span className="ai-status-dot" />
            AI Assistant
          </span>
        </div>

        <div className="ai-messages" aria-live="polite">
          {messages.length === 0 && (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <Bot size={29} />
              </div>
              <h3>How can I help with your research?</h3>
              <p>
                Ask a question and I’ll search the available regulatory
                evidence and display the returned citations.
              </p>

              <div className="ai-suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => askQuestion(suggestion)}
                    disabled={loading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <article
              className={`ai-message ai-message-${message.role}`}
              key={`${message.role}-${index}`}
            >
              <div className="ai-message-avatar">
                {message.role === 'user' ? (
                  <User size={17} />
                ) : (
                  <Bot size={18} />
                )}
              </div>

              <div className="ai-message-content">
                {message.role === 'user' ? (
                  <p className="ai-user-text">{message.content}</p>
                ) : message.error ? (
                  <div className="ai-error-message">
                    <AlertCircle size={17} />
                    <span>{message.error}</span>
                  </div>
                ) : (
                  <AnswerContent
                    data={message.data}
                    requestId={message.requestId}
                  />
                )}
              </div>
            </article>
          ))}

          {loading && (
            <div className="ai-thinking" role="status">
              <LoaderCircle size={17} className="ai-spinner" />
              Thinking... Searching regulatory evidence
            </div>
          )}
        </div>

        {error && (
          <p className="ai-input-error" role="alert">
            {error}
          </p>
        )}

        <form
          className="ai-composer"
          onSubmit={(event) => {
            event.preventDefault()
            askQuestion()
          }}
        >
          <textarea
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value)
              if (error) setError('')
            }}
            placeholder="Ask about a regulation, clause, or obligation..."
            rows={3}
            maxLength={1000}
            minLength={3}
            disabled={loading}
            aria-label="Your regulatory question"
          />

          <div className="ai-composer-footer">
            <span>{question.length}/1000 characters</span>
            <button
              type="submit"
              disabled={loading || question.trim().length < 3}
            >
              <Send size={16} />
              Send question
            </button>
          </div>
        </form>

        <p className="ai-footnote">
          AI responses may be incomplete. Check the cited document and page
          before relying on an answer.
        </p>
      </section>
    </div>
  )
}

function AnswerContent({ data, requestId }) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  const validIds = new Set(data.grounding?.valid_citation_ids || [])
  const invalidIds = new Set(data.grounding?.invalid_citation_ids || [])
  const citations = data.citations || []
  const chunks = data.retrieved_chunks || []

  function renderAnswer(text) {
    const parts = text.split(/(\[[^\]]+\])/g)

    return parts.map((part, index) => {
      const match = part.match(/^\[([^\]]+)\]$/)

      if (!match) {
        return <span key={index}>{part}</span>
      }

      const id = match[1]
      const status = validIds.has(id)
        ? 'valid'
        : invalidIds.has(id)
          ? 'invalid'
          : 'unknown'

      return (
        <span
          className={`ai-citation-token ai-citation-${status}`}
          key={`${id}-${index}`}
          title={
            status === 'valid'
              ? 'Citation ID found in retrieved evidence'
              : status === 'invalid'
                ? 'Citation ID was not validated'
                : 'Citation status not confirmed'
          }
        >
          {part}
        </span>
      )
    })
  }

  return (
    <div className="ai-answer">
      {data.insufficient_evidence ? (
        <div className="ai-insufficient">
          Couldn't find enough relevant information in the documents.
        </div>
      ) : (
        <div className="ai-answer-text">
          {data.answer
            ? renderAnswer(data.answer)
            : 'No answer was returned by the service.'}
        </div>
      )}

      {data.grounded && (
        <div className="ai-grounding-note">
          <ShieldCheck size={15} />
          <div>
            <strong>Citations verified</strong>
            <p>
              The cited IDs were found in the retrieved evidence. This does
              not independently verify every statement in the answer.
            </p>
          </div>
        </div>
      )}

      {data.warning && (
        <div className="ai-warning">{data.warning}</div>
      )}

      {citations.length > 0 && (
        <div className="ai-citations">
          <h4>
            <FileText size={15} />
            Sources
          </h4>
          {citations.map((citation, index) => (
            <div
              className="ai-source-card"
              key={`${citation.chunk_id}-${index}`}
            >
              <div>
                <strong>{citation.document_name || 'Regulatory document'}</strong>
                <span>
                  {citation.page_number != null
                    ? `Page ${citation.page_number}`
                    : 'Page not provided'}
                  {citation.paragraph_ref
                    ? ` · ${citation.paragraph_ref}`
                    : ''}
                </span>
              </div>
              <span
                className={`ai-source-status ${
                  validIds.has(citation.chunk_id) ? 'is-valid' : 'is-unknown'
                }`}
              >
                {validIds.has(citation.chunk_id)
                  ? 'Citation ID found'
                  : 'Check source'}
              </span>
            </div>
          ))}
        </div>
      )}

      <details
        className="ai-support-details"
        open={detailsOpen}
        onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
      >
        <summary>Support details</summary>
        <p>Request ID: {requestId || 'Not provided'}</p>
        <p>Grounding status: {data.grounding?.status || 'Not provided'}</p>
        <p>Retrieved evidence chunks: {chunks.length}</p>
      </details>
    </div>
  )
}
