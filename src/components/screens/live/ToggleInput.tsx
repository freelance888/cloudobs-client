type ToggleInputProps = {
	label: string;
	icon?: string;
	value: boolean;
	syncAll?: boolean;
	onValueChanged: (updatedValue: boolean) => void;
	onSyncAllChanged?: (updatedSyncAll: boolean) => void;
};

const toKebabCase = (str: string) => {
	return str.replace(/\s+/g, "-").toLowerCase();
};

const ToggleInput: React.FC<ToggleInputProps> = (props: ToggleInputProps) => {
	const { label, icon, value, syncAll, onValueChanged, onSyncAllChanged } = props;

	return (
		<div className="ToggleInput">
			<label htmlFor={toKebabCase(label)} className="pe-2">
				{onSyncAllChanged && (
					<input
						className="form-check-input me-2 sync-all-cursor-help"
						type="checkbox"
						title="Apply to all languages"
						checked={syncAll}
						onChange={(event) => onSyncAllChanged?.(event.target.checked)}
					/>
				)}
				{icon && <i className={`bi bi-${icon}`} />} {value ? "Enabled" : "Disabled"}
			</label>
			<div className="form-check form-switch">
				<input
					className="form-check-input"
					type="checkbox"
					role="switch"
					checked={value}
					onChange={() => onValueChanged(!value)}
				/>
			</div>
		</div>
	);
};

export default ToggleInput;
