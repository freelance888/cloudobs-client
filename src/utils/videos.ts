export const isSameLanguage = (videoName: string, language: string) => {
	return videoName.includes(`${language.toUpperCase()}_`);
};

export const startsWithDigit = (videoName: string) => {
	return /^\d/.test(videoName);
};
