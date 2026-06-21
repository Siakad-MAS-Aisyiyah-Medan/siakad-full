import { ArrowLeft, ArrowRight, Loader2, Send, Save } from 'lucide-react';

export default function FormActions({
  showBack,
  onBack,
  onPrimary,
  onSaveDraft,
  primaryLabel,
  primaryLoading,
  primaryLoadingLabel,
  draftLoading,
  disabled,
  isReview,
  showSaveDraft = true,
}) {
  return (
    <div className="wizard-form-actions">
      {/* Back button */}
      <div>
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            disabled={disabled}
            className="wizard-action-btn wizard-action-btn--ghost"
          >
            <ArrowLeft size={17} />
            Sebelumnya
          </button>
        ) : (
          <span />
        )}
      </div>

      {/* Right side */}
      <div className="wizard-form-actions__right">


        <button
          type="button"
          onClick={onPrimary}
          disabled={disabled || primaryLoading}
          className={`wizard-action-btn wizard-action-btn--primary${isReview ? ' wizard-action-btn--submit' : ''}`}
        >
          {primaryLoading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              {primaryLoadingLabel}
            </>
          ) : (
            <>
              {primaryLabel}
              {isReview
                ? <Send size={16} />
                : <ArrowRight size={17} className="wizard-action-arrow" />
              }
            </>
          )}
        </button>
      </div>
    </div>
  );
}
