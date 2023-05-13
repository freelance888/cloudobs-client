export enum ServerStatus {
	SLEEPING = "sleeping",
	NOT_INITIALIZED = "not initialized",
	INITIALIZING = "initializing",
	RUNNING = "running",
	DISPOSING = "disposing",
}

type LangCode = string;
export type LangMap<T> = Record<LangCode, T>;

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

export type MediaScheduleStatus = {
	running: boolean;
	timestamp: string;
};

export type GlobalSettings = {
	server_langs: InitialSettings;
	stream_settings: StreamDestinationSettings;
	stream_on: { value: boolean };
	ts_offset: { value: number };
	ts_volume: { value: number };
	source_volume: { value: number };
	sidechain: SidechainSettings;
	transition: { transition_point: number };
	gdrive_settings: GDriveSettings;
};

export type Transition = "Cut" | "Stinger";
export type MediaPlaySettings = {
	name: string;
	search_by_num: 0 | 1;
};

export type TransitionSettings = {
	transition_point: number;
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

export type SourceVolumeSettings = Pick<StreamParametersSettings, "sourceVolume">["sourceVolume"];
export type TranslationVolumeSettings = Pick<StreamParametersSettings, "translationVolume">["translationVolume"];
export type TranslationOffsetSettings = Pick<StreamParametersSettings, "translationOffset">["translationOffset"];

export type OptionsFlags<Type> = {
	[Property in keyof Type]: boolean;
};

export type SyncableSettings = Omit<StreamParametersSettings, "streamActive"> & SidechainSettings & TransitionSettings;
export type SyncableSettingsFlags = OptionsFlags<SyncableSettings>;

export type LanguageSettings = {
	initial: InitialSettings;
	streamParameters: StreamParametersSettings;
	streamDestination: StreamDestinationSettings;
	sidechain: SidechainSettings;
	transition: TransitionSettings;
	gDrive: GDriveSettings;
};

export type LanguagesSettings = LangMap<LanguageSettings>;

export type VMixPlayerOld = {
	ip: string;
	name: string;
	active: boolean;
};

export type GDriveFile = [
	string, // filename
	boolean // loaded
];

export interface AddrConfig {
	obs_host: string;
	minion_server_addr: string;
	websocket_port: number;
	password: string;
	original_media_url: string;
}

export interface StreamSettings {
	server: string;
	key: string;
}

export interface StreamOn {
	value: boolean;
}

export interface TsOffset {
	value: number;
}

export interface TsVolume {
	value: number;
}

export interface SourceVolume {
	value: number;
}

export interface GdriveSettings {
	folder_id: string;
	media_dir: string;
	api_key: string;
	sync_seconds: number;
	gdrive_sync_addr: string;
}

export interface MinionConfig {
	addr_config: AddrConfig;
	stream_settings: StreamSettings;
	stream_on: StreamOn;
	ts_offset: TsOffset;
	ts_volume: TsVolume;
	source_volume: SourceVolume;
	sidechain_settings: SidechainSettings;
	transition_settings: TransitionSettings;
	gdrive_settings: GdriveSettings;
}

export interface TimingEntry {
	name: string;
	timestamp: string;
	is_enabled: boolean;
	is_played: boolean;
}

export type VMixPlayer = {
	name: string;
	active: boolean;
};

type VideoName = string;

export type VideoLoaded = Record<VideoName, boolean>;

export type Registry = {
	obs_sheet_url: string | null;
	obs_sheet_name: string | null;
	minion_configs: LangMap<MinionConfig>;
	infrastructure_lock: boolean;
	server_status: ServerStatus;
	timing_sheet_url: string | null;
	timing_sheet_name: string | null;
	timing_start_time: string | null;
	vmix_players: Record<string, VMixPlayer>;
	active_vmix_player: string;
	timing_list: TimingEntry[];
	gdrive_files: LangMap<VideoLoaded>;
};
