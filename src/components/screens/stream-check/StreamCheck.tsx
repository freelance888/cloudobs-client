import { useState } from "react";

import YouTube from "react-youtube";
import ReactPlayer from "react-player";

const StreamCheck = () => {
	const [streams, setStreams] = useState<string[]>([]);
	const handleStreamInput = async (event) => {
		const streamLinks = event.target.value;
		const streamLinkArray = streamLinks.split("\n");
		setStreams(streamLinkArray);
	};
	const handleDeleteStream = (index) => {
		const newStreams = [...streams];
		newStreams.splice(index, 1);
		setStreams(newStreams);
	};

	const handleGoToSource = (link) => {
		window.open(link, "_blank");
	};

	const getYouTubeID = (url) => {
		url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		return url[2] !== undefined ? url[2].split(/[^0-9a-z_-]/i)[0] : url[0];
	};

	const isYoutubeUrl = (url: string) => {
		const valid =
			/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;
		return valid.test(url);
	};

	return (
		<div className="container">
			<div className="content-panel m-auto">
				<h2 style={{ marginTop: "10px" }}>Check YouTube Streams</h2>
				<div className="form-group">
					<textarea
						className="form-control"
						onChange={handleStreamInput}
						placeholder="Enter YouTube stream links, each link on a new line"
						value={streams.join("\n")}
						style={{ height: "200px", marginBottom: "25px", borderStyle: "dashed" }}
					/>
				</div>
			</div>
			<ul className="list-unstyled d-flex flex-wrap justify-content-start">
				{streams
					.filter((stream) => stream !== "")
					.map((stream, index) => (
						<li key={index} style={{ marginBottom: "20px", maxWidth: "400px", marginRight: "25px" }}>
							{isYoutubeUrl(stream) ? (
								<YouTube
									videoId={getYouTubeID(stream)}
									opts={{
										height: "280",
										width: "400",
										playerVars: {
											mute: true,
											vq: "144p",
											autoplay: 1,
										},
									}}
								/>
							) : (
								<ReactPlayer url={stream} height={280} width={400} muted playing style={{ marginBottom: "6px" }} />
							)}
							<div className="btn-group" role="group">
								<button
									className="btn btn-primary"
									style={{ marginRight: "10px" }}
									onClick={() => handleDeleteStream(index)}
								>
									Delete
								</button>
								<button className="btn btn-danger" onClick={() => handleGoToSource(stream.link)}>
									Go to source
								</button>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
};

export default StreamCheck;
