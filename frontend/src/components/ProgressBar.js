

const ProgressBar = (progress) => {
  
    const colors = [
      'rgb(255, 214, 161)',
      'rgb(255, 175, 163)',
      'rgb(108, 115, 148)',
      'rgb(141, 181, 145)'
    ]

    let barColor = colors[Math.floor(Math.random() * colors.length)]

    if (progress.progress < 25) {
      barColor = colors[0]
    } else if (progress.progress < 50) {
      barColor = colors[1]
    } else if (progress.progress < 75) {
      barColor = colors[2]
    } else {
      barColor = colors[3]
    }
  
    const progressStyle = {width: `${progress.progress}%`, backgroundColor: barColor}

    return (
      <div className="outer-bar">
        <div className="inner-bar"
              style = {progressStyle}
        >

        </div>
      </div>
    );
  }
  
  export default ProgressBar;