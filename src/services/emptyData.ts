import {
	InitialSettings,
	StreamDestinationSettings,
	StreamParametersSettings,
	SidechainSettings,
	LanguageSettings,
	GDriveSettings,
} from "./types";

const EMPTY_INITIAL_SETTINGS: InitialSettings = {
	host_url: "",
	websocket_port: "4439",
	password: "",
	original_media_url: "",
};

const EMPTY_STREAM_DESTINATION_SETTINGS: StreamDestinationSettings = {
	server: "",
	key: "",
};

const EMPTY_STREAM_PARAMETERS_SETTINGS: StreamParametersSettings = {
	streamActive: false,
	sourceVolume: 0,
	translationVolume: 0,
	translationOffset: 4000,
};

const EMPTY_SIDECHAIN_SETTINGS: SidechainSettings = {
	ratio: 32,
	release_time: 1000,
	threshold: -15,
	output_gain: 0,
};

const EMPTY_GDRIVE_SETTINGS: GDriveSettings = {
	drive_id: "",
	media_dir: "/home/stream/content",
	api_key: "",
	sync_seconds: 10,
	gdrive_sync_addr: "http://localhost:7000",
	objvers: "",
};

export const EMPTY_LANGUAGE_SETTINGS: LanguageSettings = {
	initial: EMPTY_INITIAL_SETTINGS,
	streamParameters: EMPTY_STREAM_PARAMETERS_SETTINGS,
	streamDestination: EMPTY_STREAM_DESTINATION_SETTINGS,
	sidechain: EMPTY_SIDECHAIN_SETTINGS,
	gDrive: EMPTY_GDRIVE_SETTINGS,
};
