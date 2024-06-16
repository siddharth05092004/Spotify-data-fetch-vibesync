function Search() {
  function search() {
    const input = document.getElementById("inputField");
    window.location = "/search?q=" + input.value;
  }

  return (
    <>
      <div className="poppins-medium h-screen flex justify-center items-center">
        <div class="max-w-2xl rounded-lg bg-white shadow-md p-8 flex flex-col space-y-4">
          <h1 class="text-6xl font-bold text-center">VIBESYNC</h1>
          <div class="flex w-full">
            <input
              type="text"
              id="inputField"
              class="block w-full p-3 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Enter text..."
            />
            <button
              onClick={search}
              type="button"
              id="submitButton"
              class="ml-2 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-bold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
