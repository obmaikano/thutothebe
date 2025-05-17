function Field({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center mb-2">
            <p className="sm:w-1/3 font-bold mb-1 sm:mb-0">{label}</p>
            <p className="sm:w-2/2">{value || "N/A"}</p>
        </div>
    );
}

export default Field;
