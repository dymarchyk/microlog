import morgan from 'morgan'
export default  morgan('[:date[clf]] ":method :url " Status: :status, Size: :res[content-length]\n From: ":referrer" UA: ":user-agent"\n Time: :total-time ms \n')