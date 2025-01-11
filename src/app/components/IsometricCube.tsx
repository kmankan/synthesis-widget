const IsometricCube = ({ width = "50px", height = "50px" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={width}
    height={height}
  >
    <path
      d="M 50 85 L 80 70 L 80 35 L 50 50 Z"
      fill="#4AA9FF"
      stroke="none"
    />
    <path
      d="M 20 70 L 50 85 L 50 50 L 20 35 Z"
      fill="#A8DDFF"
      stroke="none"
    />
    <path
      d="M 20 35 L 50 50 L 80 35 L 50 20 Z"
      fill="#75C2FF"
      stroke="none"
    />
  </svg>
)

export default IsometricCube