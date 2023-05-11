import { useState } from "react";
import YouTube from "react-youtube";
import ReactPlayer from "react-player";

const StreamCheck = () => {
	const [streamsText, setStreamsText] = useState("");
	const [streams, setStreams] = useState<{ title: string; url: string }[]>([]);

	const handleStreamInput = async (event) => {
		const text = event.target.value;
		setStreamsText(text);

		const streamLines = text.split("\n");
		const streamArray = streamLines.map((line) => {
			// eslint-disable-next-line prefer-const
			let [title, url] = line.split(" "); // Assuming that title and url are separated by a space
			url = url || ""; // If url is undefined, use an empty string instead
			return { title, url };
		});
		setStreams(streamArray);
	};
	const handleDeleteStream = (index) => {
		const newStreams = [...streams];
		newStreams.splice(index, 1);
		setStreams(newStreams);
		const newStreamsText = newStreams.map((stream) => `${stream.title} ${stream.url}`).join("\n");
		setStreamsText(newStreamsText);
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
		<div>
			<div className="content-panel m-auto">
				<h2 style={{ marginTop: "10px" }}>Check YouTube Streams</h2>
				<div className="form-group">
					<textarea
						className="form-control"
						onChange={handleStreamInput}
						placeholder="Enter stream title and YouTube stream link separated by a space, each pair on a new line"
						value={streamsText}
						style={{ height: "200px", marginBottom: "25px", borderStyle: "dashed" }}
					/>
				</div>
			</div>
			<ul className="list-unstyled d-flex flex-wrap justify-content-start">
				{streams
					.filter((stream) => stream.url !== "")
					.map((stream, index) => (
						<li key={index} style={{ marginBottom: "20px", maxWidth: "400px", marginRight: "25px" }}>
							<h4
								style={{
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									maxWidth: "400px",
								}}
							>
								{stream.title}
							</h4>
							{isYoutubeUrl(stream.url) ? (
								<YouTube
									videoId={getYouTubeID(stream.url)}
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
								<ReactPlayer url={stream.url} height={280} width={400} muted playing style={{ marginBottom: "6px" }} />
							)}
							<div className="btn-group" role="group">
								<button
									className="btn btn-primary"
									style={{ marginRight: "10px" }}
									onClick={() => handleDeleteStream(index)}
								>
									Delete
								</button>
								<button className="btn btn-danger" onClick={() => handleGoToSource(stream.url)}>
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
