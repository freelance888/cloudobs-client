import { ReactNode, useCallback } from "react";
import classNames from "classnames";

type Props = {
	children: ReactNode;
	mainActions?: ReactNode;
	endActions?: ReactNode;
	actionsOnTop?: boolean;
	centered?: boolean;
};

const ContentPanel: React.FC<Props> = (props: Props) => {
	const centered = props.centered != null ? props.centered : true;

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
		<div className={classNames("content-panel", { "m-auto": centered })}>
			{props.actionsOnTop && renderActions()}
			<div className="content-panel__children">{props.children}</div>
			{!props.actionsOnTop && renderActions()}
		</div>
	);
};

export default ContentPanel;
