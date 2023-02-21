import React, { useState } from "react";

import YouTube from "react-youtube";

interface Stream {
	link: string;
	player: any;
	muted: boolean;
	name: string;
}

const StreamCheck = () => {
	const [streams, setStreams] = useState<Stream[]>([]);
	const handleStreamInput = async (event) => {
		const streamLinks = event.target.value;

		const streamLinkArray = streamLinks.split("\n");

		const newStreams = streamLinkArray.map((link) => {
			return {
				link: link,
				player: null,
				muted: true,
				name: streams.find((stream) => stream.link === link)?.name || "",
			};
		});

		setStreams(newStreams);
	};
	const handleDeleteStream = (index) => {
		const newStreams = [...streams];
		newStreams.splice(index, 1);
		setStreams(newStreams);
	};

	const handleGoToSource = (link) => {
		window.open(link, "_blank");
	};

	const onReady = async (event, index) => {
		const newStreams = [...streams];
		const player = event.target;
		newStreams[index].player = player;

		const videoData = await player.getVideoData();
		newStreams[index].name = videoData.title;

		setStreams(newStreams);
	};

	const getYouTubeID = (url) => {
		url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		return url[2] !== undefined ? url[2].split(/[^0-9a-z_-]/i)[0] : url[0];
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
						value={streams.map((stream) => stream.link).join("\n")}
						style={{ height: "200px", marginBottom: "25px", borderStyle: "dashed" }}
					/>
				</div>
			</div>
			<ul className="list-unstyled d-flex flex-wrap justify-content-start">
				{streams
					.filter((stream) => stream.link !== "")
					.map((stream, index) => (
						<li key={index} style={{ marginBottom: "20px", maxWidth: "400px", marginRight: "25px" }}>
							<h6 style={{ textOverflow: "hidden", height: "40px" }}>{stream.name}</h6>
							<YouTube
								videoId={getYouTubeID(stream.link)}
								onReady={(event) => onReady(event, index)}
								opts={{
									height: "280",
									width: "400",
									playerVars: {
										mute: stream.muted ? 1 : 0,
										vq: "144p",
										autoplay: 1,
									},
								}}
							/>
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
