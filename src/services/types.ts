export type All<T> = Record<string, T>;

export type MediaScheduleItem = {
	name: string;
	timestamp: string;
	is_enabled: boolean;
	is_played: boolean;
};

export type UpdatedMediaScheduleItem = { id: string } & Partial<Omit<MediaScheduleItem, "is_played">>;

export type MediaSchedule = Record<string, MediaScheduleItem>; // id: { name: "...", ... }

export type NewMediaScheduleItem = [string, string];
export type NewMediaSchedule = NewMediaScheduleItem[];

export type GlobalSettings = {
	server_langs: InitialSettings;
	stream_settings: StreamDestinationSettings;
	stream_on: { value: boolean };
	ts_offset: { value: number };
	ts_volume: { value: number };
	source_volume: { value: number };
	sidechain: SidechainSettings;
	transition: { transition_name: "Cut" | "Stinger"; path: string; transition_point: number };
	gdrive_settings: GDriveSettings;
};

export type Transition = "Cut" | "Stinger";
export type MediaPlaySettings = {
	name: string;
	search_by_num: 0 | 1;
};

export type TransitionSettings = {
	transition_name: Transition;
	transition_point: number;
	path: string;
};

export type GDriveSettings = {
	drive_id: string;
	media_dir: string;
	api_key: string;
	sync_seconds: number;
	gdrive_sync_addr: string;
	objvers: string;
};

export type InitialSettings = {
	host_url: string;
	websocket_port: string;
	password: string;
	original_media_url: string;
};

export type SheetInitialSettings = {
	sheetUrl: string;
	worksheetName: string;
};

export type StreamParametersSettings = {
	streamActive: boolean;
	sourceVolume: number;
	translationVolume: number;
	translationOffset: number;
};

export type StreamDestinationSettings = {
	server: string;
	key: string;
};

export type SidechainSettings = {
	ratio: number;
	release_time: number;
	threshold: number;
	output_gain: number;
};

type AnySettings =
	| InitialSettings
	| StreamParametersSettings
	| StreamDestinationSettings
	| SidechainSettings
	| GDriveSettings;

export type SourceVolumeSettings = Pick<StreamParametersSettings, "sourceVolume">["sourceVolume"];
export type TranslationVolumeSettings = Pick<StreamParametersSettings, "translationVolume">["translationVolume"];
export type TranslationOffsetSettings = Pick<StreamParametersSettings, "translationOffset">["translationOffset"];

export type OptionsFlags<Type> = {
	[Property in keyof Type]: boolean;
};

export type SyncableSettings = Omit<StreamParametersSettings, "streamActive"> &
	SidechainSettings &
	Pick<TransitionSettings, "transition_point">;
export type SyncableSettingsFlags = OptionsFlags<SyncableSettings>;

export type LanguageSettings = {
	initial: InitialSettings;
	streamParameters: StreamParametersSettings;
	streamDestination: StreamDestinationSettings;
	sidechain: SidechainSettings;
	transition: TransitionSettings;
	gDrive: GDriveSettings;
};

export type LanguagesSettings = All<LanguageSettings>;

export type VMixPlayer = {
	ip: string;
	label: string;
	active: boolean;
};

export type NewVMixPlayer = Omit<VMixPlayer, "active">;

export type GDriveFile = [
	string, // filename
	boolean // loaded
];

const getAllSettings = <T extends AnySettings>(
	languagesSettings: LanguagesSettings,
	parameter: keyof LanguageSettings
): All<T> => {
	const allSettings: All<T> = {};

	Object.keys(languagesSettings).forEach((language) => {
		allSettings[language] = languagesSettings[language][parameter] as T;
	});

	return allSettings;
};

export const getAllInitialSettings = (languagesSettings: LanguagesSettings): All<InitialSettings> => {
	return getAllSettings(languagesSettings, "initial");
};

export const getAllStreamDestinationSettings = (
	languagesSettings: LanguagesSettings
): Record<string, StreamDestinationSettings> => {
	return getAllSettings(languagesSettings, "streamDestination");
};

export const getAllSidechainSettings = (languagesSettings: LanguagesSettings): All<SidechainSettings> => {
	return getAllSettings(languagesSettings, "sidechain");
};

export const getAllGDriveSettings = (languagesSettings: LanguagesSettings): All<GDriveSettings> => {
	return getAllSettings(languagesSettings, "gDrive");
};
