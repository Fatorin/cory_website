export const LinkBar = () => {
    return (
        <div className="justify-center items-center flex flex-wrap gap-4">
            <a target="_blank" href="https://www.twitch.tv/kuriyamacory" rel="noopener noreferrer">
                <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-purple-400 ring-2 ring-purple-900 font-bold hover:text-white">
                    Twitch
                </div>
            </a>
            <a target="_blank" href="https://www.youtube.com/c/kuriyamacory" rel="noopener noreferrer">
                <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-red-600 ring-2 ring-red-900 font-bold hover:text-white">
                    Youtube
                </div>
            </a>
            <a target="_blank" href="https://twitter.com/kuriyamacory" rel="noopener noreferrer">
                <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-blue-600 ring-2 ring-blue-900 font-bold hover:text-white">
                    Twitter
                </div>
            </a>
            <a target="_blank" href="https://coryshop.booth.pm/" rel="noopener noreferrer">
                <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-red-500 ring-2 ring-red-900 font-bold hover:text-white">
                    BOOTH
                </div>
            </a>
            <a target="_blank" href="https://cory.fanbox.cc/" rel="noopener noreferrer">
                <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-500 px-4 rounded-lg border-2 border-blue-200 bg-yellow-400 ring-2 ring-yellow-900 font-bold hover:text-white">
                    FANBOX
                </div>
            </a>
        </div>
    )
}