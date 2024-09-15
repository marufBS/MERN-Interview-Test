import React from 'react'

const Dashboard = () => {

    const data = [1,2,3,4,5,6]
  return (
    <div className=''>
        {
            data.map((d,i)=>(
                <div>hello</div>
            ))
        }
    </div>
  )
}

export default Dashboard