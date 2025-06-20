"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Github, MapPin, Users, Star, GitFork, ExternalLink, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"

interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  location: string
  public_repos: number
  followers: number
  following: number
  html_url: string
  created_at: string
}

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
}

export default function GitHubSearch() {
  const [username, setUsername] = useState("")
  const [debouncedUsername, setDebouncedUsername] = useState("")
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [reposPage, setReposPage] = useState(1)
  const [totalRepos, setTotalRepos] = useState(0)
  const { theme, setTheme } = useTheme()

  // Debounce username input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username)
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  // Auto-search when debounced username changes
  useEffect(() => {
    if (debouncedUsername.trim()) {
      handleSearch()
    }
  }, [debouncedUsername])

  const fetchUserData = async (searchUsername: string) => {
    const response = await fetch(`https://api.github.com/users/${searchUsername}`)
    if (!response.ok) {
      throw new Error(response.status === 404 ? "User not found" : "Failed to fetch user data")
    }
    return response.json()
  }

  const fetchUserRepos = async (searchUsername: string, page = 1) => {
    const response = await fetch(
      `https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=5&page=${page}`,
    )
    if (!response.ok) {
      throw new Error("Failed to fetch repositories")
    }
    return response.json()
  }

  const handleSearch = useCallback(async () => {
    if (!debouncedUsername.trim()) return

    setLoading(true)
    setError("")
    setReposPage(1)

    try {
      const [userData, reposData] = await Promise.all([
        fetchUserData(debouncedUsername),
        fetchUserRepos(debouncedUsername, 1),
      ])

      setUser(userData)
      // Sort repos by stars and take top 5
      const sortedRepos = reposData.sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
      setRepos(sortedRepos)
      setTotalRepos(userData.public_repos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setUser(null)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }, [debouncedUsername])

  const loadMoreRepos = async () => {
    if (!user) return

    setLoading(true)
    try {
      const nextPage = reposPage + 1
      const moreRepos = await fetchUserRepos(user.login, nextPage)
      setRepos((prev) => [...prev, ...moreRepos])
      setReposPage(nextPage)
    } catch (err) {
      setError("Failed to load more repositories")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <h1 className="text-xl font-bold">GitHub User Search</h1>
          </div>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">Search automatically as you type</p>
        </div>

        {/* Error State */}
        {error && (
          <Card className="max-w-md mx-auto mb-8 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && !user && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* User Profile */}
        {user && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name || user.login} />
                    <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
                      <p className="text-muted-foreground">@{user.login}</p>
                    </div>

                    {user.bio && <p className="text-sm">{user.bio}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {user.followers} followers · {user.following} following
                      </div>
                      <div>Joined {formatDate(user.created_at)}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button asChild>
                        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Repositories */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Repositories ({user.public_repos})</h3>
              </div>

              {repos.length > 0 ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {repos.map((repo) => (
                      <Card key={repo.id} className="h-full">
                        <CardHeader>
                          <CardTitle className="text-base">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-2"
                            >
                              {repo.name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </CardTitle>
                          {repo.description && (
                            <CardDescription className="text-sm">{repo.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              {repo.language && (
                                <Badge variant="secondary" className="text-xs">
                                  {repo.language}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {repo.stargazers_count}
                              </div>
                              <div className="flex items-center gap-1">
                                <GitFork className="h-3 w-3" />
                                {repo.forks_count}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Updated {formatDate(repo.updated_at)}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {repos.length < totalRepos && (
                    <div className="text-center">
                      <Button onClick={loadMoreRepos} disabled={loading} variant="outline">
                        {loading ? "Loading..." : "Load More Repositories"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No public repositories found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Initial State */}
        {!user && !loading && !error && (
          <div className="text-center max-w-md mx-auto">
            <Github className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Search GitHub Users</h2>
            <p className="text-muted-foreground">
              Enter a GitHub username above to view their profile and repositories
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
