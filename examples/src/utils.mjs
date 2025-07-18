export function getEnabledFiltersFromQueryString()
{
    const params = new URLSearchParams(window.location.search);

    if (!params.has('enabled'))
    {
        return [];
    }

    return params.get('enabled').split(',');
}
