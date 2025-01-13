export const sortPosts = (posts, sortBy, sortOrder) => {
    return posts.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "likes") {
        return sortOrder === "desc" ? a.likes - b.likes : b.likes - a.likes;
      }
    });
  };
  
  export const filterPostsBySkills = (posts, selectedSkills) => {
    if (!selectedSkills.length) return posts;
    return posts.filter(post =>
      selectedSkills.every(skill => post.skillIds.includes(skill))
    );
  };
  