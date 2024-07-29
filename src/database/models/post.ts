export default interface Post {
  id: number,
  userId: number,
  operand: number,
  operator: string | undefined,
  parentPostId: number | undefined,
}
