
const filterDataBySearch = (dataList: any[], search: string, keysToSearch: string[], setDataFn: React.Dispatch<any>) => {
    const filteredData = dataList.filter((item: any) => {
        const searchMatch = !search || keysToSearch.some((key: any) =>
            String(item[key] ?? '').toLowerCase().includes(search.toLowerCase())
        );
        return searchMatch;
    });

    setDataFn(filteredData);
};

export default filterDataBySearch;