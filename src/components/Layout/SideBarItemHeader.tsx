interface SideBarItemHeaderProps {
  label: string;
}

const SideBarItemHeader = ({ label }: SideBarItemHeaderProps) => {
  return (
    <div className="mb-1 px-2.5 pt-1 xl:px-3">
      <span className="text-muted-foreground/70 3xl:text-[12px] text-[11px] font-semibold tracking-[0.08em] uppercase">
        {label}
      </span>
    </div>
  );
};

export default SideBarItemHeader;
