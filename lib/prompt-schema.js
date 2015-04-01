//schemas for prompts
module.exports = {
	user: {
		properties: {
			githubUsername: {
				pattern: /^[a-zA-Z\s\-0-9]+$/,
				description: "Enter your Github username".cyan,
				required: true
			},
			githubPassword: {
				hidden: true,
				description: "Enter your Github password".cyan,
				required: true
			},
			codestreamPassword: {
				hidden: true,
				description: "Enter your Codestream password".cyan,
				required: true
			}
		}
	},
	repo: {
		properties: {
			repositoryResponse: {
				description: "If your repository is listed, Enter the number of that repository, or type 'new' to create one\n".green
			}
		}
	},

	newRepo: {
		properties: {
			newRepoName: {
				description: "Enter the name of your new remote repository".cyan
			}
		}
	}
}