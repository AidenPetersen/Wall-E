module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Wall-E (release-onlineCollege) is Online! Logging in as ${client.user.tag}`);
    	client.user.setActivity(`rohan write bad code`, { type: `WATCHING` })
	},
};