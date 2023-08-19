import {
	GDriveSettings,
	InitialSettings,
	LanguageSettings,
	SidechainSettings,
	StreamDestinationSettings,
	StreamParametersSettings,
	TransitionSettings,
	TsGainSettings,
	TsLimiterSettings,
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
	translationOffset: 8000,
	vmixSpeakerBackgroundVolume: 0,
};

const EMPTY_SIDECHAIN_SETTINGS: SidechainSettings = {
	ratio: 32,
	release_time: 1000,
	threshold: -15,
	output_gain: 0,
	enabled: true,
};

const EMPTY_TRANSITION_SETTINGS: TransitionSettings = {
	transition_point: 6800,
};

const EMPTY_GDRIVE_SETTINGS: GDriveSettings = {
	drive_id: "",
	media_dir: "/home/stream/content",
	api_key: "",
	sync_seconds: 10,
	gdrive_sync_addr: "http://localhost:7000",
	objvers: "",
};

const EMPTY_TEAMSPEAK_GAIN_SETTINGS: TsGainSettings = {
	gain: 0,
	enabled: true,
};

const EMPTY_TEAMSPEAK_LIMITER_SETTINGS: TsLimiterSettings = {
	enabled: true,
	threshold: -6,
	release_time: 60,
};

export const EMPTY_LANGUAGE_SETTINGS: LanguageSettings = {
	initial: EMPTY_INITIAL_SETTINGS,
	streamParameters: EMPTY_STREAM_PARAMETERS_SETTINGS,
	streamDestination: EMPTY_STREAM_DESTINATION_SETTINGS,
	sidechain: EMPTY_SIDECHAIN_SETTINGS,
	transition: EMPTY_TRANSITION_SETTINGS,
	tsGain: EMPTY_TEAMSPEAK_GAIN_SETTINGS,
	tsLimiter: EMPTY_TEAMSPEAK_LIMITER_SETTINGS,
	gDrive: EMPTY_GDRIVE_SETTINGS,
};
