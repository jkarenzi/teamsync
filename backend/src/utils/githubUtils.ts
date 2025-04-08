import { Octokit } from '@octokit/rest'
import { AppDataSource } from '../dbConfig'
import dotenv from 'dotenv'
import GithubContributionData from '../entities/GithubContributionData'
import Group from '../entities/Group'
import { Console } from 'console'
dotenv.config()


const token = process.env.GITHUB_TOKEN
const githubUsername = process.env.GITHUB_USERNAME
const githubContributionDataRepository = AppDataSource.getRepository(GithubContributionData)

const octokit = new Octokit({ auth: token })

// async function getOctokit() {
//     const { Octokit } = await import("@octokit/rest")
//     return new Octokit({ auth: token })
// }

export const addCollaborators = async(repoName:string, collaborators:string[]) => {
    try{
        for(const collaborator of collaborators){
            if(!collaborator){
                continue
            }
    
            await octokit.repos.addCollaborator({
                owner: process.env.GITHUB_USERNAME,
                repo: repoName,
                username: collaborator,
                permission: "push"
            })
        }

        return {error:''}
    }catch(err){
        return {error: err.message || 'Failed to add collaborator'}
    }
}

export const removeCollaborators = async(repoName: string, collaborators: string[]) => {
    try {
        for(const collaborator of collaborators) {
            if(!collaborator) {
                continue;
            }
            
            await octokit.repos.removeCollaborator({
                owner: process.env.GITHUB_USERNAME,
                repo: repoName,
                username: collaborator,
                permission: "push"
            });
        }

        return {error:''}
    } catch(err) {
        return {error: err.message  || 'Failed to remove collaborator'}
    }
}


export const createGithubRepo = async(repoName:string, collaborators?:string[]) => {
    try{
        // const octokit = await getOctokit();
        const response = await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            private: false
        })
        
        const newRepoName = response.data.name

        const {error} = await addCollaborators(newRepoName, collaborators)
        if(error){
            return {error: `Repository created but another error occured. <${error}>`,repoName:'', repoLink:''}
        }
        
        return {repoName: newRepoName, repoLink: response.data.html_url, error:''}
    }catch(err){
        return {error: err.message || 'Failed to add collaborator'}
    }
}

export const getGithubContributionStats = async(group: Group, repoName:string) => {
    try{
        const response = await octokit.repos.getContributorsStats({
            owner: githubUsername,
            repo: repoName,
        });

        console.log(response)

        if(!response.data || Object.keys(response.data).length === 0) {
            const githubContribData = await githubContributionDataRepository.findOne({
                where: {
                    group: {
                        id: group.id
                    }
                }
            })

            if(githubContribData?.contributorStats){
                return githubContribData.contributorStats
            }else{
                return []
            }
        }

        const formattedData = response.data.map(contributor => {
            return {
                username: contributor.author.login,
                totalCommits: contributor.total,
                weeklyData: contributor.weeks
            }
        })

        let githubContribData = await githubContributionDataRepository.findOne({
            where: { group: { id: group.id } }
        });
        
        if (!githubContribData) {
            githubContribData = githubContributionDataRepository.create({ group });
        }
        
        githubContribData.contributorStats = formattedData;
        await githubContributionDataRepository.save(githubContribData);

        return formattedData
    }catch(err){
        console.log(err)
    }
}

export const deleteRepo = async(repoName:string) => {
    try {
      await octokit.repos.delete({
        owner: githubUsername,
        repo: repoName,
      })

      console.log("Repository deleted successfully.");
      return {error:''}
    } catch (error) {
      console.error("Error deleting repository:", error.message);
      return {error: error.message || 'Failed to delete repository'}
    }
  }