// src/components/LimitPopup.tsx

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LimitPopup({
  open,
  onClose,
}: Props) {

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "400px",
          background: "#111827",
          color: "white",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
          }}
        >
          Daily Limit Reached
        </h2>

        <p
          style={{
            opacity: 0.8,
          }}
        >
          You have reached today's free usage limit.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Upgrade Premium
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back Tomorrow
          </button>
        </div>
      </div>
    </div>
  );
}
