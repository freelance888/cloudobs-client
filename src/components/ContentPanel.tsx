import { ReactNode, useCallback } from "react";

type Props = {
	children: ReactNode;
	mainActions?: ReactNode;
	endActions?: ReactNode;
	actionsOnTop?: boolean;
};

const ContentPanel: React.FC<Props> = (props: Props) => {
	const renderActions = useCallback(() => {
		return (
			(props.mainActions || props.endActions) && (
				<div className="content-panel__actions">
					<div className="content-panel__actions-main">{props.mainActions}</div>
					<div className="content-panel__actions-end">{props.endActions}</div>
				</div>
			)
		);
	}, [props.mainActions, props.endActions]);

	return (
		<div className="content-panel">
			{props.actionsOnTop && renderActions()}
			<div className="content-panel__children">{props.children}</div>
			{!props.actionsOnTop && renderActions()}
		</div>
	);
};

export default ContentPanel;
