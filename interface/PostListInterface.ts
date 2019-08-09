import PostSummaryInterface from './PostSummaryInterface'

export default interface PostListInterface {
  posts: PostSummaryInterface[]
  prev: number
  next: number
}
