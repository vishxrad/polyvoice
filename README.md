"# polyvoice"

<button
              onClick={toggleSidebar}
              className="hidden md:block text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
{sidebarOpen ? (

) : (
<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
<path d="M5 12h14M12 5l7 7-7 7" />
</svg>
)}
</button>

            <Button
                onClick={joinRoom}
                variant="shadow"
                color="success"
                className={
                  sidebarOpen
                    ? "w-full"
                    : "w-8 h-8 p-0 min-w-0 md:flex md:justify-center md:items-center"
                }
                title="Join Room"
              >
                {sidebarOpen ? (
                  "Join Room"
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 19l-7-7 7-7M4 12h16" />
                  </svg>
                )}
              </Button>
