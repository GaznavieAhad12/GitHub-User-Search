"use client"

import { useState, useEffect } from "react"
import { Search, Github, MapPin, Users, Star, GitFork, ExternalLink, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"

export default function GitHubSearch() {
  const [username, setUsername] = useState("")
  const [debouncedUsername, setDebouncedUsername] = useState("")
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showMore, setShowMore] = useState(false)
  const { theme, setTheme } = useTheme()

  // Debounce username input (bonus feature)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username)
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  const fetchUserData = async (searchUsername) => {
    const response = await fetch(`https://api.github.com/users/${searchUsername}`)
    if (!response.ok) {
      throw new Error(response.status === 404 ? "User not found" : "Failed to fetch user data")
    }
    return response.json()
  }

  const fetchUserRepos = async (searchUsername) => {
    const response = await fetch(`https://api.github.com/users/${searchUsername}/repos?per_page=100`)
    if (!response.ok) {
      throw new Error("Failed to fetch repositories")
    }
    return response.json()
  }

  const handleSearch = async (searchUsername = username) => {
    if (!searchUsername.trim()) {
      setError("Please enter a username")
      return
    }

    setLoading(true)
    setError("")
    setUser(null)
    setRepos([])
    setShowMore(false)

    try {
      const [userData, reposData] = await Promise.all([fetchUserData(searchUsername), fetchUserRepos(searchUsername)])

      setUser(userData)

      // Sort repositories by stars and get top 5
      const sortedRepos = reposData.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5)

      setRepos(sortedRepos)
    } catch (err) {
      setError(err.message || "An error occurred")
      setUser(null)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-search with debounce (bonus feature)
  useEffect(() => {
    if (debouncedUsername.trim() && debouncedUsername !== username) {
      handleSearch(debouncedUsername)
    }
  }, [debouncedUsername])

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* User Profile Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repositories Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <h1 className="text-xl font-bold">GitHub User Search</h1>
          </div>
          {/* Dark Mode Toggle (Bonus Feature) */}
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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleSearch()} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">Press Enter or click Search button</p>
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
        {loading && <LoadingSkeleton />}

        {/* User Profile and Repositories */}
        {user && !loading && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* User Profile */}
            <Card>
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
                          View on GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top 5 Repositories */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Top 5 Repositories (by stars)</h3>
                <Badge variant="secondary">{user.public_repos} total repos</Badge>
              </div>

              {repos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {repos.map((repo) => (
                    <Card key={repo.id} className="h-full flex flex-col">
                      <CardHeader className="flex-1">
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
                          <CardDescription className="text-sm line-clamp-3">{repo.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {repo.language && (
                              <Badge variant="secondary" className="text-xs">
                                {repo.language}
                              </Badge>
                            )}
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
                          <p className="text-xs text-muted-foreground">Updated {formatDate(repo.updated_at)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
            <p className="text-muted-foreground mb-4">
              Enter a GitHub username to view their profile and top 5 repositories sorted by stars
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✨ Features included:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Responsive design</li>
                <li>Dark mode toggle</li>
                <li>Debounced search</li>
                <li>Error handling</li>
                <li>Loading states</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
