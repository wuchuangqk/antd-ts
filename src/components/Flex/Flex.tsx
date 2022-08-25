import React from "react"
type Direction = "row" | "column"
type JustifyContent = "normal" | "center" | "space-between" | "space-around" | "space-evenly" | "flex-start" | "flex-end"
type AlignItems = "normal" | "center"
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction
  justifyContent?: JustifyContent
  alignItems?: AlignItems
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
const Flex: React.FC<FlexProps> = ({ direction = 'row', justifyContent, alignItems, children, className }) => {
  const style: any = { flexDirection: direction }
  if (justifyContent) style.justifyContent = justifyContent
  if (alignItems) style.alignItems = alignItems
  return (
    <div className={`flex ${className}`} style={style}>
      {children}
    </div>
  )
}

export default Flex