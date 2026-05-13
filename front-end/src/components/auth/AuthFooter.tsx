type AuthFooterProps = {
  text: string;
  actionText: "Log in" | "Sign up";
  onClick: () => void;
};

export function AuthFooter({
  text,
  actionText,
  onClick,
}: AuthFooterProps) {
  return (
    <div className="text-center text-sm text-gray-500">
      {text}{" "}
      <button
        onClick={onClick}
        className="text-orange-500 font-semibold cursor-pointer hover:underline"
      >
        {actionText}
      </button>
    </div>
  );
}