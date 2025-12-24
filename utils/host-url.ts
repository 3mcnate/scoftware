export function createHostUrl(host: string)
{
	if(host.match(/^localhost:\d{2,5}$/)) {
		return `http://${host}`;
	}
	return `https://${host}`
}