import { ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';

export default function FormActions({
  showBack,
  onBack,
  onPrimary,
  primaryLabel,
  primaryLoading,
  primaryLoadingLabel,
  disabled,
  isReview,
}) {
  return (
    <div className="wizard-form-actions">
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
