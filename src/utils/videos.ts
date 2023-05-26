export const isSameLanguage = (videoName: string, language: string) => {
	return videoName.includes(`${language.toUpperCase()}_`);
};
