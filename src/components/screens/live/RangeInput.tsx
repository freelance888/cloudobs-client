import { useEffect, useState } from "react";

type RangeInputProps = {
	label: string;
	icon?: string;
	minValue: number;
	maxValue: number;
	value: number;
	syncAll?: boolean;
	units?: string;
	step?: number;
	onValueChanged: (updatedValue: number) => void;
	onSyncAllChanged?: (updatedSyncAll: boolean) => void;
};

const toKebabCase = (str: string) => {
	return str.replace(/\s+/g, "-").toLowerCase();
};

const RangeInput: React.FC<RangeInputProps> = (props: RangeInputProps) => {
	const {
		label,
		icon,
		minValue,
		maxValue,
		step,
		value: initialValue,
		syncAll,
		units,
		onValueChanged,
		onSyncAllChanged,
	} = props;
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	return (
		<div className="RangeInput">
			<label htmlFor={toKebabCase(label)}>
				{onSyncAllChanged && (
					<input
						className="form-check-input me-2 sync-all-cursor-help"
						type="checkbox"
						title="Apply to all languages"
						checked={syncAll}
						onChange={(event) => onSyncAllChanged?.(event.target.checked)}
					/>
				)}
				{icon && <i className={`bi bi-${icon}`} />} {label} ({value}
				{units && ` ${units}`})
			</label>
			<input
				type="range"
				className="form-range"
				id={toKebabCase(label)}
				min={minValue}
				max={maxValue}
				step={step}
				value={value}
				onChange={(event) => {
					setValue(Number(event.target.value));
				}}
				onMouseUpCapture={() => onValueChanged(value)}
			/>
		</div>
	);
};

export default RangeInput;
